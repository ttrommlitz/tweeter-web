import { AuthToken, Status, User, FakeData, LoadMoreStatusItemsRequest, PostStatusRequest } from "tweeter-shared";
import { ServerFacade } from "../network/ServerFacade";

export class StatusService {
  private serverFacade: ServerFacade;

  constructor() {
    this.serverFacade = new ServerFacade();
  }

  async loadMoreFeedItems (
    authToken: AuthToken,
    user: User,
    pageSize: number,
    lastItem: Status | null
  ): Promise<[Status[], boolean]> {
    const request = new LoadMoreStatusItemsRequest(authToken, user, lastItem, pageSize);
    const response = await this.serverFacade.loadMoreFeedItems(request);

    return [response.statusItems, response.hasMoreItems];

  };

  async loadMoreStoryItems (
    authToken: AuthToken,
    user: User,
    pageSize: number,
    lastItem: Status | null
  ): Promise<[Status[], boolean]> {
    const request = new LoadMoreStatusItemsRequest(authToken, user, lastItem, pageSize);
    const response = await this.serverFacade.loadMoreStoryItems(request);

    return [response.statusItems, response.hasMoreItems];
  };

  public async postStatus (
    authToken: AuthToken,
    newStatus: Status
  ): Promise<void> {
    const request = new PostStatusRequest(authToken, newStatus);
    await this.serverFacade.postStatus(request);
  };
}