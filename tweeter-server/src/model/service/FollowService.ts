import { AuthToken, User } from "tweeter-shared";
import { FactoryInterface } from "./Factory";
import { Service } from "./Service";
import { Follow } from "../entity/Follow";

export class FollowService extends Service {
  constructor(factory: FactoryInterface) {
    super(factory);
  }

  public async loadMoreFollowers (
    authToken: AuthToken,
    user: User,
    pageSize: number,
    lastItem: User | null
  ): Promise<[User[], boolean]> {
    await this.verifyToken(authToken)

    const pageOfFollows = await this.followsDao.getPageOfFollowers(user.alias, pageSize, lastItem?.alias)
    
    const users: User[] = []

    for (const follow of pageOfFollows.items) {
      const user = await this.userDao.getUser(follow.follower_handle)
      if (user !== null) {
        users.push(user)
      }
    }

    return [users, pageOfFollows.hasMorePages]
  };

  public async loadMoreFollowees (
    authToken: AuthToken,
    user: User,
    pageSize: number,
    lastItem: User | null
  ): Promise<[User[], boolean]> {
    await this.verifyToken(authToken)

    const pageOfFollows = await this.followsDao.getPageOfFollowees(user.alias, pageSize, lastItem?.alias)

    const users: User[] = []

    for (const follow of pageOfFollows.items) {
      const user = await this.userDao.getUser(follow.followee_handle)
      if (user !== null) {
        users.push(user)
      }
    }

    return [users, pageOfFollows.hasMorePages]
  };

  public async getIsFollowerStatus (
    authToken: AuthToken,
    user: User,
    selectedUser: User
  ): Promise<boolean> {
    await this.verifyToken(authToken)

    const follow: Follow = new Follow(
      user.alias,
      user.firstName,
      selectedUser.alias,
      selectedUser.firstName
    )
    return !!(await this.followsDao.getFollow(follow))
  };

  public async getFolloweesCount (
    authToken: AuthToken,
    user: User
  ): Promise<number> {
    await this.verifyToken(authToken)

    return await this.userDao.getNumFollowing(user.alias)
  };

  public async getFollowersCount (
    authToken: AuthToken,
    user: User
  ): Promise<number> {
    await this.verifyToken(authToken)

    return await this.userDao.getNumFollowers(user.alias)
  };

  public async follow (
    authToken: AuthToken,
    currentUser: User,
    userToFollow: User
  ) {
    await this.verifyToken(authToken)

    const follow: Follow = new Follow(
      currentUser.alias,
      currentUser.firstName,
      userToFollow.alias,
      userToFollow.firstName
    )
    await this.followsDao.putFollow(follow)

    await this.userDao.updateNumFollowing(currentUser.alias, "inc")
    await this.userDao.updateNumFollowers(userToFollow.alias, "inc")
  };

  public async unfollow (
    authToken: AuthToken,
    currentUser: User,
    userToUnfollow: User
  ) {
    await this.verifyToken(authToken)

    const follow: Follow = new Follow(
      currentUser.alias,
      currentUser.firstName,
      userToUnfollow.alias,
      userToUnfollow.firstName
    
    )
    await this.followsDao.deleteFollow(follow)

    await this.userDao.updateNumFollowing(currentUser.alias, "dec")
    await this.userDao.updateNumFollowers(userToUnfollow.alias, "dec")
  };
}