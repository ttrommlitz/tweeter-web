import { DeleteCommand, DynamoDBDocumentClient, GetCommand, PutCommand, UpdateCommand } from "@aws-sdk/lib-dynamodb";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { AuthToken } from "tweeter-shared";

const TIME_TO_LIVE = 4 * 60 * 60 * 1000; // 4 hours in milliseconds

export interface AuthtokenDaoInterface {
  putAuthtoken(token: AuthToken): Promise<void>;
  getAuthtoken(token: AuthToken): Promise<AuthToken | null>;
  deleteAuthtoken(token: AuthToken): Promise<void>;
  updateAuthtoken(token: AuthToken): Promise<void>;
}

export class AuthtokenDao implements AuthtokenDaoInterface {
  private readonly client = DynamoDBDocumentClient.from(new DynamoDBClient({}));

  public async putAuthtoken(token: AuthToken): Promise<void> {
    await this.client.send(new PutCommand({
      TableName: "Authtoken",
      Item: {
        token: token.token,
        expiration: token.timestamp + TIME_TO_LIVE
      }
    }));
  }

  public async getAuthtoken(token: AuthToken): Promise<AuthToken | null> {
    const response = await this.client.send(new GetCommand({
      TableName: "Authtoken",
      Key: { token: token.token }
    }));

    if (response.Item === undefined) {
      return null;
    }

    return new AuthToken(response.Item.token, response.Item.expiration);
  }

  public async deleteAuthtoken(token: AuthToken): Promise<void> {
    await this.client.send(new DeleteCommand({
      TableName: "Authtoken",
      Key: { token: token.token }
    }));
  }

  public async updateAuthtoken(token: AuthToken): Promise<void> {
    await this.client.send(new UpdateCommand({
      TableName: "Authtoken",
      Key: { token: token.token },
      UpdateExpression: "SET expiration = :expiration",
      ExpressionAttributeValues: {
        ":expiration": Date.now() + TIME_TO_LIVE
      }
    }));
  }
}