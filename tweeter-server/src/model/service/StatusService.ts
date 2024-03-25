import { AuthToken, Status, User, FakeData } from "tweeter-shared";

export class StatusService {
  async loadMoreFeedItems (
    authToken: AuthToken,
    user: User,
    pageSize: number,
    lastItem: Status | null
  ): Promise<[Status[], boolean]> {
    return FakeData.instance.getPageOfStatuses(lastItem, pageSize);
  };

  async loadMoreStoryItems (
    authToken: AuthToken,
    user: User,
    pageSize: number,
    lastItem: Status | null
  ): Promise<[Status[], boolean]> {
    return FakeData.instance.getPageOfStatuses(lastItem, pageSize);
  };

  public async postStatus (
    authToken: AuthToken,
    newStatus: Status
  ): Promise<void> {
    // TODO: Post status by changing db
  };
}