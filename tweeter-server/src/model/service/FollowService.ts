import { AuthToken, User, FakeData } from "tweeter-shared";

export class FollowService {
  public async loadMoreFollowers (
    authToken: AuthToken,
    user: User,
    pageSize: number,
    lastItem: User | null
  ): Promise<[User[], boolean]> {
    return FakeData.instance.getPageOfUsers(lastItem, pageSize, user);
  };

  public async loadMoreFollowees (
    authToken: AuthToken,
    user: User,
    pageSize: number,
    lastItem: User | null
  ): Promise<[User[], boolean]> {
    return FakeData.instance.getPageOfUsers(lastItem, pageSize, user);
  };

  public async getIsFollowerStatus (
    authToken: AuthToken,
    user: User,
    selectedUser: User
  ): Promise<boolean> {
    return FakeData.instance.isFollower();
  };

  public async getFolloweesCount (
    authToken: AuthToken,
    user: User
  ): Promise<number> {
    return FakeData.instance.getFolloweesCount(user);
  };

  public async getFollowersCount (
    authToken: AuthToken,
    user: User
  ): Promise<number> {
    return FakeData.instance.getFollowersCount(user);
  };

  public async follow (
    authToken: AuthToken,
    userToFollow: User
  ) {
    // TODO: change db
  };

  public async unfollow (
    authToken: AuthToken,
    userToUnfollow: User
  ) {
    // TODO: Change db
  }; 
}