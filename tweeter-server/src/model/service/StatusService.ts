import { AuthToken, Status, User } from "tweeter-shared";
import { FactoryInterface } from "./Factory";
import { Service } from "./Service";

export class StatusService extends Service {
  constructor(factory: FactoryInterface) {
    super(factory);
  }

  async loadMoreFeedItems (
    authToken: AuthToken,
    user: User,
    pageSize: number,
    lastItem: Status | null
  ): Promise<[Status[], boolean]> {
    await this.verifyToken(authToken)
    
    const page = await this.feedDao.getPageOfFeedItems(user.alias, pageSize, lastItem?.timestamp)
    return [page.items, page.hasMorePages]
  };

  async loadMoreStoryItems (
    authToken: AuthToken,
    user: User,
    pageSize: number,
    lastItem: Status | null
  ): Promise<[Status[], boolean]> {
    await this.verifyToken(authToken)

    const page = await this.storyDao.getPageOfStoryItems(user.alias, pageSize, lastItem?.timestamp)
    return [page.items, page.hasMorePages]
  };

  // FOR 4B: post the status and the posterAlias to postStatus sqs queue, have a lambda process that which queries the follows table to get followers,
  // then posts 25 follower aliases at a time to a new sqs queue, which triggers a lambda to write to the feed table

  public async postStatus (
    authToken: AuthToken,
    newStatus: Status
  ): Promise<void> {
    await this.verifyToken(authToken)

    await this.storyDao.putStoryStatus(newStatus.user.alias, newStatus)


    
    let hasMorePages = true
    let lastFollowerAlias: string | undefined = undefined

    while (hasMorePages) {
      const page = await this.followsDao.getPageOfFollowers(newStatus.user.alias, 100, lastFollowerAlias)
      const followerAliases = page.items.map(follow => follow.follower_handle)
      await this.feedDao.batchWriteFeedStatus(followerAliases, newStatus)
      hasMorePages = page.hasMorePages
      lastFollowerAlias = page.items.length > 0 ? page.items[page.items.length - 1].follower_handle : undefined
    }
  };
}