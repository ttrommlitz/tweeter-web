import { DynamoDBDocumentClient, GetCommand, PutCommand, UpdateCommand, UpdateCommandInput } from "@aws-sdk/lib-dynamodb";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { User } from "tweeter-shared";

export interface UserDaoInterface {
  putUser(user: User, hashedPassword: string): Promise<void>;
  getUser(alias: string): Promise<User | null>;
  getHashedPassword(alias: string): Promise<string | null>;
  getNumFollowers(alias: string): Promise<number>;
  getNumFollowing(alias: string): Promise<number>;
  updateNumFollowers(alias: string, incrementOrDecrement: "inc" | "dec"): Promise<void>;
  updateNumFollowing(alias: string, incrementOrDecrement: "inc" | "dec"): Promise<void>;
}

export class UserDao implements UserDaoInterface {
  private readonly client = DynamoDBDocumentClient.from(new DynamoDBClient({}));

  async putUser(user: User, hashedPassword: string) {
    await this.client.send(new PutCommand({
      TableName: "User",
      Item: {
        alias: user.alias,
        firstName: user.firstName,
        lastName: user.lastName,
        imageUrl: user.imageUrl,
        password: hashedPassword,
        numFollowers: 0,
        numFollowing: 0
      }
    }))
  }

  async getUser(alias: string): Promise<User | null> {
    const response = await this.client.send(new GetCommand({
      TableName: "User",
      Key: { alias }
    }))

    return response.Item === undefined ? null : new User(
      response.Item.firstName,
      response.Item.lastName,
      response.Item.alias,
      response.Item.imageUrl
    )
  }

  async getHashedPassword(alias: string): Promise<string | null> {
    const response = await this.client.send(new GetCommand({
      TableName: "User",
      Key: { alias }
    }))

    return response.Item === undefined ? null : response.Item.password
  }

  async getNumFollowers(alias: string): Promise<number> {
    const response = await this.client.send(new GetCommand({
      TableName: "User",
      Key: { alias }
    }))

    return response.Item === undefined ? 0 : response.Item.numFollowers
  }

  async getNumFollowing(alias: string): Promise<number> {
    const response = await this.client.send(new GetCommand({
      TableName: "User",
      Key: { alias }
    }))

    return response.Item === undefined ? 0 : response.Item.numFollowing
  }

  async updateNumFollowers(alias: string, incrementOrDecrement: "inc" | "dec") {
    const params: UpdateCommandInput = {
      TableName: "User",
      Key: { alias },
      UpdateExpression: incrementOrDecrement === "inc"
        ? "SET numFollowers = numFollowers + :val"
        : "SET numFollowers = numFollowers - :val",
      ExpressionAttributeValues: { ":val": 1 }
    }

    await this.client.send(new UpdateCommand(params))
  }

  async updateNumFollowing(alias: string, incrementOrDecrement: "inc" | "dec") {
    const params: UpdateCommandInput = {
      TableName: "User",
      Key: { alias },
      UpdateExpression: incrementOrDecrement === "inc"
        ? "SET numFollowing = numFollowing + :val"
        : "SET numFollowing = numFollowing - :val",
      ExpressionAttributeValues: { ":val": 1 }
    }

    await this.client.send(new UpdateCommand(params))
  }
}