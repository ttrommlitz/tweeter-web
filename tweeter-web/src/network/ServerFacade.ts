import { AuthenticateResponse, FollowActionRequest, GetFolloweesCountResponse, GetFollowersCountResponse, GetFollowsCountRequest, GetIsFollowerStatusRequest, GetIsFollowerStatusResponse, GetUserRequest, GetUserResponse, LoadMoreStatusItemsRequest, LoadMoreStatusItemsResponse, LoadMoreUserItemsRequest, LoadMoreUserItemsResponse, LoginRequest, LogoutRequest, PostStatusRequest, RegisterRequest } from "tweeter-shared";
import { ClientCommunicator } from "./ClientCommunicator";
import { TweeterResponse } from "tweeter-shared/dist/model/net/Response";

export class ServerFacade {

  private SERVER_URL = "https://uolgez0npb.execute-api.us-east-1.amazonaws.com/dev";

  private clientCommunicator = new ClientCommunicator(this.SERVER_URL);

  async login(request: LoginRequest): Promise<AuthenticateResponse> {
    const endpoint = "/login";
    const response: JSON = await this.clientCommunicator.doPost<LoginRequest>(request, endpoint);

    return AuthenticateResponse.fromJson(response);
  }

  async register(request: RegisterRequest): Promise<AuthenticateResponse> {
    const endpoint = "/register";
    const response: JSON = await this.clientCommunicator.doPost<RegisterRequest>(request, endpoint);

    return AuthenticateResponse.fromJson(response);
  }

  async logout(request: LogoutRequest): Promise<TweeterResponse> {
    const endpoint = "/logout";
    const response: JSON = await this.clientCommunicator.doPost<LogoutRequest>(request, endpoint);

    return TweeterResponse.fromJson(response);
  }

  async getUser(request: GetUserRequest): Promise<GetUserResponse> {
    const endpoint = "/user";
    const response: JSON = await this.clientCommunicator.doPost<GetUserRequest>(request, endpoint);

    return GetUserResponse.fromJson(response);
  }

  async loadMoreFeedItems(request: LoadMoreStatusItemsRequest): Promise<LoadMoreStatusItemsResponse> {
    const endpoint = "/loadmorefeeditems";
    const response: JSON = await this.clientCommunicator.doPost<LoadMoreStatusItemsRequest>(request, endpoint);

    return LoadMoreStatusItemsResponse.fromJson(response);
  }

  async loadMoreStoryItems(request: LoadMoreStatusItemsRequest): Promise<LoadMoreStatusItemsResponse> {
    const endpoint = "/loadmorestoryitems";
    const response: JSON = await this.clientCommunicator.doPost<LoadMoreStatusItemsRequest>(request, endpoint);

    return LoadMoreStatusItemsResponse.fromJson(response);
  }

  async loadMoreFollowers(request: LoadMoreUserItemsRequest): Promise<LoadMoreUserItemsResponse> {
    const endpoint = "/loadmorefollowers";
    const response: JSON = await this.clientCommunicator.doPost<LoadMoreUserItemsRequest>(request, endpoint);

    return LoadMoreUserItemsResponse.fromJson(response);
  }

  async loadMoreFollowees(request: LoadMoreUserItemsRequest): Promise<LoadMoreUserItemsResponse> {
    const endpoint = "/loadmorefollowees";
    const response: JSON = await this.clientCommunicator.doPost<LoadMoreUserItemsRequest>(request, endpoint);

    return LoadMoreUserItemsResponse.fromJson(response);
  }

  async postStatus(request: PostStatusRequest): Promise<TweeterResponse> {
    const endpoint = "/post";
    const response: JSON = await this.clientCommunicator.doPost<PostStatusRequest>(request, endpoint);

    return TweeterResponse.fromJson(response);
  }

  async getIsFollowerStatus(request: GetIsFollowerStatusRequest): Promise<GetIsFollowerStatusResponse> {
    const endpoint = "/isfollower";
    const response: JSON = await this.clientCommunicator.doPost<GetIsFollowerStatusRequest>(request, endpoint);

    return GetIsFollowerStatusResponse.fromJson(response);
  }

  async getFolloweesCount(request: GetFollowsCountRequest): Promise<GetFolloweesCountResponse> {
    const endpoint = "/followeescount";
    const response: JSON = await this.clientCommunicator.doPost<GetFollowsCountRequest>(request, endpoint);

    return GetFolloweesCountResponse.fromJson(response);
  }

  async getFollowersCount(request: GetFollowsCountRequest): Promise<GetFollowersCountResponse> {
    const endpoint = "/followerscount";
    const response: JSON = await this.clientCommunicator.doPost<GetFollowsCountRequest>(request, endpoint);

    return GetFollowersCountResponse.fromJson(response);
  }

  async follow(request: FollowActionRequest): Promise<TweeterResponse> {
    const endpoint = "/follow";
    const response: JSON = await this.clientCommunicator.doPost<FollowActionRequest>(request, endpoint);

    return TweeterResponse.fromJson(response);
  }

  async unfollow(request: FollowActionRequest): Promise<TweeterResponse> {
    const endpoint = "/unfollow";
    const response: JSON = await this.clientCommunicator.doPost<FollowActionRequest>(request, endpoint);

    return TweeterResponse.fromJson(response);
  }
}