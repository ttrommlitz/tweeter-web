import {
  DynamoDBDocumentClient,
  QueryCommandInput,
  QueryCommand,
  BatchWriteCommand,
  BatchWriteCommandInput
} from "@aws-sdk/lib-dynamodb";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { Status } from "tweeter-shared";
import { DataPage } from "../model/entity/DataPage";
import { chunk } from "lodash";

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
  
      await this.client.send(new BatchWriteCommand(params));
    }
  }
}