import { AuthToken } from "../domain/AuthToken";
import { Status } from "../domain/Status";
import { User } from "../domain/User";

export class TweeterResponse {
  success: boolean
  message: string | null

  constructor(success: boolean, message: string | null = null) {
    this.success = success
    this.message = message
  }

  static fromJson(json: JSON): TweeterResponse {
    interface TweeterResponseJson extends ResponseJson {}

    const jsonObject: TweeterResponseJson =
      json as unknown as TweeterResponseJson;

    return new TweeterResponse(
      jsonObject.success,
      jsonObject.message
    );
  }
}

interface ResponseJson {
  success: boolean;
  message: string;
}

export class AuthenticateResponse extends TweeterResponse {
  user: User
  token: AuthToken

  constructor(user: User, token: AuthToken, success: boolean, message: string | null = null) {
    super(success, message)
    this.user = user
    this.token = token
  }

  static fromJson(json: JSON): AuthenticateResponse {
    interface AuthenticateResponseJson extends ResponseJson {
      user: JSON;
      token: JSON;
    }

    const jsonObject: AuthenticateResponseJson =
      json as unknown as AuthenticateResponseJson;
    const deserializedUser = User.fromJson(JSON.stringify(jsonObject.user));

    if (deserializedUser === null) {
      throw new Error(
        "AuthenticateResponse, could not deserialize user with json:\n" +
          JSON.stringify(jsonObject.user)
      );
    }

    const deserializedToken = AuthToken.fromJson(
      JSON.stringify(jsonObject.token)
    );

    if (deserializedToken === null) {
      throw new Error(
        "AuthenticateResponse, could not deserialize token with json:\n" +
          JSON.stringify(jsonObject.token)
      );
    }

    return new AuthenticateResponse(
      deserializedUser,
      deserializedToken,
      jsonObject.success,
      jsonObject.message
    );
  }
}

export class GetUserResponse extends TweeterResponse {
  user: User | null

  constructor(user: User | null, success: boolean, message: string | null = null) {
    super(success, message)
    this.user = user
  }

  static fromJson(json: JSON): GetUserResponse {
    interface GetUserResponseJson extends ResponseJson {
      user: JSON;
    }

    const jsonObject: GetUserResponseJson =
      json as unknown as GetUserResponseJson;
    const deserializedUser = User.fromJson(JSON.stringify(jsonObject.user));

    if (deserializedUser === null) {
      throw new Error(
        "GetUserResponse, could not deserialize user with json:\n" +
          JSON.stringify(jsonObject.user)
      );
    }

    return new GetUserResponse(
      deserializedUser,
      jsonObject.success,
      jsonObject.message
    );
  }
}

export class LoadMoreStatusItemsResponse extends TweeterResponse {
  statusItems: Status[]
  hasMoreItems: boolean

  constructor(statusItems: Status[], hasMoreItems: boolean, success: boolean, message: string | null = null) {
    super(success, message)
    this.statusItems = statusItems
    this.hasMoreItems = hasMoreItems
  }

  static fromJson(json: JSON): LoadMoreStatusItemsResponse {
    interface LoadMoreFeedItemsResponseJson extends ResponseJson {
      statusItems: JSON[],
      hasMoreItems: boolean
    }

    const jsonObject: LoadMoreFeedItemsResponseJson = 
      json as unknown as LoadMoreFeedItemsResponseJson

    const deserializedStatusItems = jsonObject.statusItems.map(statusItem => {
      const deserializedStatus = Status.fromJson(JSON.stringify(statusItem));
      if (deserializedStatus === null) {
        throw new Error(
          "LoadMoreFeedItemsResponse, could not deserialize status with json:\n" +
            JSON.stringify(statusItem)
        );
      }
      return deserializedStatus
    })

    return new LoadMoreStatusItemsResponse(
      deserializedStatusItems,
      jsonObject.hasMoreItems,
      jsonObject.success,
      jsonObject.message
    )
  }
}

export class LoadMoreUserItemsResponse extends TweeterResponse {
  users: User[]
  hasMoreItems: boolean

  constructor(users: User[], hasMoreItems: boolean, success: boolean, message: string | null = null) {
    super(success, message)
    this.users = users
    this.hasMoreItems = hasMoreItems
  }

  static fromJson(json: JSON): LoadMoreUserItemsResponse {
    interface LoadMoreUserItemsResponseJson extends ResponseJson {
      users: JSON[],
      hasMoreItems: boolean
    }

    const jsonObject: LoadMoreUserItemsResponseJson = 
      json as unknown as LoadMoreUserItemsResponseJson

    const deserializedUsers = jsonObject.users.map(user => {
      const deserializedUser = User.fromJson(JSON.stringify(user));
      if (deserializedUser === null) {
        throw new Error(
          "LoadMoreUserItemsResponse, could not deserialize user with json:\n" +
            JSON.stringify(user)
        );
      }
      return deserializedUser
    })

    return new LoadMoreUserItemsResponse(
      deserializedUsers,
      jsonObject.hasMoreItems,
      jsonObject.success,
      jsonObject.message
    )
  }
}

export class GetIsFollowerStatusResponse extends TweeterResponse {
  isFollower: boolean

  constructor(isFollower: boolean, success: boolean, message: string | null = null) {
    super(success, message)
    this.isFollower = isFollower
  }

  static fromJson(json: JSON): GetIsFollowerStatusResponse {
    interface GetIsFollowerStatusResponseJson extends ResponseJson {
      isFollower: boolean
    }

    const jsonObject: GetIsFollowerStatusResponseJson = 
      json as unknown as GetIsFollowerStatusResponseJson

    return new GetIsFollowerStatusResponse(
      jsonObject.isFollower,
      jsonObject.success,
      jsonObject.message
    )
  }
}

export class GetFolloweesCountResponse extends TweeterResponse {
  followeesCount: number

  constructor(followeesCount: number, success: boolean, message: string | null = null) {
    super(success, message)
    this.followeesCount = followeesCount
  }

  static fromJson(json: JSON): GetFolloweesCountResponse {
    interface GetFolloweesCountResponseJson extends ResponseJson {
      followeesCount: number
    }

    const jsonObject: GetFolloweesCountResponseJson = 
      json as unknown as GetFolloweesCountResponseJson

    return new GetFolloweesCountResponse(
      jsonObject.followeesCount,
      jsonObject.success,
      jsonObject.message
    )
  }
}

export class GetFollowersCountResponse extends TweeterResponse {
  followersCount: number

  constructor(followersCount: number, success: boolean, message: string | null = null) {
    super(success, message)
    this.followersCount = followersCount
  }

  static fromJson(json: JSON): GetFollowersCountResponse {
    interface GetFollowersCountResponseJson extends ResponseJson {
      followersCount: number
    }

    const jsonObject: GetFollowersCountResponseJson = 
      json as unknown as GetFollowersCountResponseJson

    return new GetFollowersCountResponse(
      jsonObject.followersCount,
      jsonObject.success,
      jsonObject.message
    )
  }
}