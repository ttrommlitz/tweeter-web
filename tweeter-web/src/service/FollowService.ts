import { AuthToken, User, FakeData, LoadMoreUserItemsRequest, GetIsFollowerStatusRequest, GetFollowsCountRequest, FollowActionRequest } from "tweeter-shared";
import { ServerFacade } from "../network/ServerFacade";

export class FollowService {
  private serverFacade: ServerFacade;

  constructor() {
    this.serverFacade = new ServerFacade();
  }

  public async loadMoreFollowers (
    authToken: AuthToken,
    user: User,
    pageSize: number,
    lastItem: User | null
  ): Promise<[User[], boolean]> {
    const request = new LoadMoreUserItemsRequest(authToken, user, lastItem, pageSize);
    const response = await this.serverFacade.loadMoreFollowers(request);

    return [response.users, response.hasMoreItems];
    // TODO: Replace with the result of calling server
    // return FakeData.instance.getPageOfUsers(lastItem, pageSize, user);
  };

  public async loadMoreFollowees (
    authToken: AuthToken,
    user: User,
    pageSize: number,
    lastItem: User | null
  ): Promise<[User[], boolean]> {
    const request = new LoadMoreUserItemsRequest(authToken, user, lastItem, pageSize);
    const response = await this.serverFacade.loadMoreFollowees(request);

    return [response.users, response.hasMoreItems];


    // TODO: Replace with the result of calling server
    // return FakeData.instance.getPageOfUsers(lastItem, pageSize, user);
  };

  public async getIsFollowerStatus (
    authToken: AuthToken,
    user: User,
    selectedUser: User
  ): Promise<boolean> {
    const request = new GetIsFollowerStatusRequest(authToken, user, selectedUser)
    const response = await this.serverFacade.getIsFollowerStatus(request);

    return response.isFollower;
  };

  public async getFolloweesCount (
    authToken: AuthToken,
    user: User
  ): Promise<number> {
    const serverFacade = new ServerFacade()
    const request = new GetFollowsCountRequest(authToken, user)
    const response = await serverFacade.getFolloweesCount(request);

    return response.followeesCount;
  };

  public async getFollowersCount (
    authToken: AuthToken,
    user: User
  ): Promise<number> {
    const request = new GetFollowsCountRequest(authToken, user)
    const response = await this.serverFacade.getFollowersCount(request);

    return response.followersCount;

  };

  public async follow (
    authToken: AuthToken,
    currentUser: User,
    userToFollow: User
  ) {
    const request = new FollowActionRequest(authToken, currentUser, userToFollow)
    await this.serverFacade.follow(request);

    let followersCount = await this.getFollowersCount(authToken, userToFollow);
    let followeesCount = await this.getFolloweesCount(authToken, userToFollow);

    return [followersCount, followeesCount];
  };

  public async unfollow (
    authToken: AuthToken,
    currentUser: User,
    userToUnfollow: User
  ) {
    const request = new FollowActionRequest(authToken, currentUser, userToUnfollow)
    await this.serverFacade.unfollow(request);

    let followersCount = await this.getFollowersCount(authToken, userToUnfollow);
    let followeesCount = await this.getFolloweesCount(authToken, userToUnfollow);

    return [followersCount, followeesCount];
  }; 
}