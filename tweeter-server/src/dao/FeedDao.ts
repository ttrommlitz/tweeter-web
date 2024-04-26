import {
  DynamoDBDocumentClient,
  QueryCommandInput,
  QueryCommand,
  BatchWriteCommand,
  BatchWriteCommandInput,
  BatchWriteCommandOutput
} from "@aws-sdk/lib-dynamodb";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { Status } from "tweeter-shared";
import { DataPage } from "../model/entity/DataPage";
import { chunk } from "lodash";
import { execSync } from "child_process";

export interface FeedDaoInterface {
  getPageOfFeedItems(receiverAlias: string, pageSize: number, lastTimestamp: number | undefined): Promise<DataPage<Status>>;
  batchWriteFeedStatus(receiverAliases: string[], status: Status): Promise<void>;
}

export class FeedDao implements FeedDaoInterface {
  private readonly client = DynamoDBDocumentClient.from(new DynamoDBClient({}));
  private readonly tableName = "Feed";

  public async getPageOfFeedItems(
    receiverAlias: string,
    pageSize: number,
    lastTimestamp: number | undefined = undefined
    ): Promise<DataPage<Status>> {
      const params: QueryCommandInput = {
        ExclusiveStartKey: lastTimestamp === undefined ? undefined : {
          receiverAlias: receiverAlias,
          timestamp: lastTimestamp
        },
        TableName: this.tableName,
        KeyConditionExpression: "receiverAlias = :receiverAlias",
        ExpressionAttributeValues: { ":receiverAlias": receiverAlias},
        Limit: pageSize
      }

      const items: Status[] = [];
      const response = await this.client.send(new QueryCommand(params));
      const hasMorePages = response.LastEvaluatedKey !== undefined;

      for (const item of response.Items ?? []) {
        const statusItem: Status | null = Status.fromJson(item.status);
        
        if (statusItem !== null) {
          items.push(statusItem);
        }
      }

      return new DataPage<Status>(items, hasMorePages)
  }

  public async batchWriteFeedStatus(receiverAliases: string[], status: Status): Promise<void> {
    const BATCH_SIZE = 15;
    const aliasChunks = chunk(receiverAliases, BATCH_SIZE);

    for (const chunk of aliasChunks) {
      const params: BatchWriteCommandInput = {
        RequestItems: {
          [this.tableName]: chunk.map(alias => {
            return {
              PutRequest: {
                Item: {
                  receiverAlias: alias,
                  timestamp: status.timestamp,
                  status: JSON.stringify(status)
                },
              }
            }
          })
        }
      }
  
      const response = await this.client.send(new BatchWriteCommand(params));
      await this.putUnprocessedItems(response, params, 0);
    }
  }

  private async putUnprocessedItems(resp: BatchWriteCommandOutput, params: BatchWriteCommandInput, attempts: number){
    if(attempts > 1) console.log(attempts + 'th attempt starting');
;   if(resp.UnprocessedItems != undefined){
      let sec = 0.03;
      if (Object.keys(resp.UnprocessedItems).length > 0) {
          console.log(Object.keys(resp.UnprocessedItems[this.tableName]).length + ' unprocessed items');
          //The ts-ignore with an @ in front must be as a comment in order to ignore an error for the next line for compiling. 
          // @ts-ignore 
          params.RequestItems = resp.UnprocessedItems;
          execSync('sleep ' + sec);
          if(sec < 10) sec += 0.1;
          await this.client.send(new BatchWriteCommand(params))
            .then(async (innerResp) => {
                if(innerResp.UnprocessedItems != undefined && Object.keys(innerResp.UnprocessedItems).length > 0){
                    params.RequestItems = innerResp.UnprocessedItems;
                    ++attempts
                    await this.putUnprocessedItems(innerResp, params, attempts)
            }
            }).catch(err => {
                console.log('error while batch writing unprocessed items ' + err);
            });
          
      }
    }
  }
}