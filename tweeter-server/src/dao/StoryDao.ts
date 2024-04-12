import { DynamoDBDocumentClient, GetCommand, GetCommandInput, PutCommand, PutCommandInput, QueryCommand, QueryCommandInput, QueryCommandOutput } from "@aws-sdk/lib-dynamodb";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { Status } from "tweeter-shared";
import { DataPage } from "../model/entity/DataPage";

export interface StoryDaoInterface {
  putStoryStatus(senderAlias: string, status: Status): Promise<void>;
  getPageOfStoryItems(senderAlias: string, pageSize: number, lastTimestamp: number | undefined): Promise<DataPage<Status>>;
}

export class StoryDao implements StoryDaoInterface {
  private readonly client = DynamoDBDocumentClient.from(new DynamoDBClient({}));
  private readonly tableName = "Story";

  public async putStoryStatus(senderAlias: string, status: Status): Promise<void> {
    const params: PutCommandInput = {
      TableName: this.tableName,
      Item: {
        senderAlias: senderAlias,
        timestamp: status.timestamp,
        status: JSON.stringify(status)
      }
    }

    await this.client.send(new PutCommand(params));
  }

  public async getPageOfStoryItems(
    senderAlias: string,
    pageSize: number,
    lastTimestamp: number | undefined = undefined
  ): Promise<DataPage<Status>> {
    const params: QueryCommandInput = {
      ExclusiveStartKey: lastTimestamp === undefined ? undefined : {
        senderAlias: senderAlias,
        timestamp: lastTimestamp
      },
      TableName: this.tableName,
      KeyConditionExpression: "senderAlias = :senderAlias",
      ExpressionAttributeValues: { ":senderAlias": senderAlias},
      Limit: pageSize
    }

    const items: Status[] = [];
    const response: QueryCommandOutput = await this.client.send(new QueryCommand(params));
    const hasMorePages = response.LastEvaluatedKey !== undefined;

    for (const item of response.Items ?? []) {
      const statusItem: Status | null = Status.fromJson(item.status);

      console.log(statusItem);
      
      if (statusItem !== null) {
        items.push(statusItem);
      }
    };

    return new DataPage<Status>(items, hasMorePages)
  }
}