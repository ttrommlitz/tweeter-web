import {
  DeleteCommand,
  DeleteCommandInput,
  DynamoDBDocumentClient,
  GetCommand,
  GetCommandInput,
  PutCommand,
  PutCommandInput,
  QueryCommand,
  QueryCommandInput
} from "@aws-sdk/lib-dynamodb";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DataPage } from "../model/entity/DataPage";
import { Follow } from "../model/entity/Follow";

export interface FollowsDaoInterface {
  putFollow(follow: Follow): Promise<void>;
  getFollow(follow: Follow): Promise<Follow | undefined>;
  deleteFollow(follow: Follow): Promise<void>;
  getPageOfFollowees(followerHandle: string, pageSize: number, lastFolloweeHandle: string | undefined): Promise<DataPage<Follow>>;
  getPageOfFollowers(followeeHandle: string, pageSize: number, lastFollowerHandle: string | undefined): Promise<DataPage<Follow>>;
}

export class FollowsDao implements FollowsDaoInterface {
  private readonly client = DynamoDBDocumentClient.from(new DynamoDBClient({}));
  private readonly tableName = "follows";

  async putFollow(follow: Follow) {
    const params: PutCommandInput = {
      TableName: this.tableName,
      Item: {
        follower_handle: follow.follower_handle,
        followee_handle: follow.followee_handle,
        follower_name: follow.follower_name,
        followee_name: follow.followee_name
      }
    }

    await this.client.send(new PutCommand(params));
  }

  async getFollow(follow: Follow) {
    const params: GetCommandInput = {
      TableName: this.tableName,
      Key: {
        follower_handle: follow.follower_handle,
        followee_handle: follow.followee_handle
      }
    }

    const response = await this.client.send(new GetCommand(params));

    if (response.Item === undefined) {
      return undefined;
    }

    return new Follow(
      response.Item.follower_handle,
      response.Item.follower_name,
      response.Item.followee_handle,
      response.Item.followee_name
    )
  }

  async deleteFollow(follow: Follow) {
    const params: DeleteCommandInput = {
      TableName: this.tableName,
      Key: {
        follower_handle: follow.follower_handle,
        followee_handle: follow.followee_handle
      }
    }

    await this.client.send(new DeleteCommand(params));
  }

  async getPageOfFollowees(
    followerHandle: string,
    pageSize: number = 2,
    lastFolloweeHandle: string | undefined = undefined
  ): Promise<DataPage<Follow>> {
    const params: QueryCommandInput = {
      ExclusiveStartKey: lastFolloweeHandle === undefined ? undefined : {
        follower_handle: followerHandle,
        followee_handle: lastFolloweeHandle
      },
      TableName: this.tableName,
      KeyConditionExpression: "follower_handle = :follower_handle",
      ExpressionAttributeValues: { ":follower_handle": followerHandle },
      Limit: pageSize
    }

    const items: Follow[] = [];
    const response = await this.client.send(new QueryCommand(params));
    const hasMorePages = response.LastEvaluatedKey !== undefined;
    for (const item of response.Items ?? []) { 
      items.push(new Follow(
        item.follower_handle,
        item.follower_name,
        item.followee_handle,
        item.followee_name
      ));
    }

    return new DataPage<Follow>(items, hasMorePages);
  }

  async getPageOfFollowers(
    followeeHandle: string,
    pageSize: number = 2,
    lastFollowerHandle: string | undefined = undefined
  ): Promise<DataPage<Follow>> {
    const params: QueryCommandInput = {
      ExclusiveStartKey: lastFollowerHandle === undefined ? undefined : {
        followee_handle: followeeHandle,
        follower_handle: lastFollowerHandle
      },
      TableName: this.tableName,
      KeyConditionExpression: "followee_handle = :followee_handle",
      ExpressionAttributeValues: { ":followee_handle": followeeHandle },
      Limit: pageSize,
      IndexName: "follows_index"
    }

    const items: Follow[] = [];
    const response = await this.client.send(new QueryCommand(params));
    const hasMorePages = response.LastEvaluatedKey !== undefined;

    for (const item of response.Items ?? []) {    
      items.push(new Follow(
        item.follower_handle,
        item.follower_name,
        item.followee_handle,
        item.followee_name
      ));
    }

    return new DataPage<Follow>(items, hasMorePages);
  }
}