import { AuthToken } from "../domain/AuthToken"
import { Status } from "../domain/Status"
import { User } from "../domain/User"

export class TweeterRequest {
  // Empty
}

export class LoginRequest extends TweeterRequest {
  alias: string
  password: string

  constructor(username: string, password: string) {
    super()
    this.alias = username
    this.password = password
  }

  static fromJSON(json: JSON): LoginRequest {
    interface LoginRequestJson {
      alias: string
      password: string
    }
    const jsonObject: LoginRequestJson = 
      json as unknown as LoginRequestJson

    return new LoginRequest(
      jsonObject.alias,
      jsonObject.password
    )
  }
}

export class RegisterRequest extends TweeterRequest {
  firstName: string
  lastName: string
  alias: string
  password: string
  imageStringBase64: string

  constructor(
    firstName: string,
    lastName: string,
    alias: string,
    password: string,
    imageStringBase64: string
  ) {
    super()
    this.firstName = firstName
    this.lastName = lastName
    this.alias = alias
    this.password = password
    this.imageStringBase64 = imageStringBase64
  }

  static fromJSON(json: JSON): RegisterRequest {
    interface RegisterRequestJson {
      firstName: string
      lastName: string
      alias: string
      password: string
      imageStringBase64: string
    }
    const jsonObject: RegisterRequestJson = 
      json as unknown as RegisterRequestJson

    return new RegisterRequest(
      jsonObject.firstName,
      jsonObject.lastName,
      jsonObject.alias,
      jsonObject.password,
      jsonObject.imageStringBase64
    )
  }
}

export class LogoutRequest extends TweeterRequest {
  authToken: AuthToken

  constructor(authToken: AuthToken) {
    super()
    this.authToken = authToken
  }

  static fromJSON(json: JSON): LogoutRequest {
    interface LogoutRequestJson {
      authToken: JSON
    }
    const jsonObject: LogoutRequestJson = 
      json as unknown as LogoutRequestJson

    const deserializedToken = AuthToken.fromJson(
      JSON.stringify(jsonObject.authToken)
    )

    if (deserializedToken === null) {
      throw new Error(
        "LogoutRequest, could not deserialize token with json:\n" +
          JSON.stringify(jsonObject.authToken)
      )
    }

    return new LogoutRequest(
      deserializedToken
    )
  }
}

export class GetUserRequest extends TweeterRequest {
  alias: string
  authToken: AuthToken

  constructor(alias: string, authToken: AuthToken) {
    super()
    this.alias = alias
    this.authToken = authToken
  }

  static fromJSON(json: JSON): GetUserRequest {
    interface GetUserRequestJson {
      alias: string
      authToken: JSON
    }
    const jsonObject: GetUserRequestJson = 
      json as unknown as GetUserRequestJson

    const deserializedToken = AuthToken.fromJson(
      JSON.stringify(jsonObject.authToken)
    )

    if (deserializedToken === null) {
      throw new Error(
        "GetUserRequest, could not deserialize token with json:\n" +
          JSON.stringify(jsonObject.authToken)
      )
    }

    return new GetUserRequest(
      jsonObject.alias,
      deserializedToken
    )
  }
}

export class LoadMoreStatusItemsRequest extends TweeterRequest {
  authToken: AuthToken
  user: User
  lastItem: Status | null
  pageSize: number

  constructor(authToken: AuthToken, user: User, lastItem: Status | null, pageSize: number) {
    super()
    this.authToken = authToken
    this.user = user
    this.lastItem = lastItem
    this.pageSize = pageSize
  }

  static fromJSON(json: JSON): LoadMoreStatusItemsRequest {
    interface LoadMoreStatusItemsRequestJson {
      authToken: JSON
      user: JSON
      lastItem: JSON
      pageSize: number
    }
    const jsonObject: LoadMoreStatusItemsRequestJson = 
      json as unknown as LoadMoreStatusItemsRequestJson

    const deserializedToken = AuthToken.fromJson(
      JSON.stringify(jsonObject.authToken)
    )

    if (deserializedToken === null) {
      throw new Error(
        "LoadMoreStatusItemsRequest, could not deserialize token with json:\n" +
          JSON.stringify(jsonObject.authToken)
      )
    }

    const deserializedUser = User.fromJson(
      JSON.stringify(jsonObject.user)
    )

    if (deserializedUser === null) {
      throw new Error(
        "LoadMoreStatusItemsRequest, could not deserialize user with json:\n" +
          JSON.stringify(jsonObject.user)
      )
    }

    const deserializedLastItem = Status.fromJson(
      jsonObject.lastItem ? JSON.stringify(jsonObject.lastItem) : null
    )

    return new LoadMoreStatusItemsRequest(
      deserializedToken,
      deserializedUser,
      deserializedLastItem,
      jsonObject.pageSize
    )
  }
}

export class LoadMoreUserItemsRequest extends TweeterRequest {
  authToken: AuthToken
  user: User
  lastItem: User | null
  pageSize: number

  constructor(authToken: AuthToken, user: User, lastItem: User | null, pageSize: number) {
    super()
    this.authToken = authToken
    this.user = user
    this.lastItem = lastItem
    this.pageSize = pageSize
  }

  static fromJSON(json: JSON): LoadMoreUserItemsRequest {
    interface LoadMoreUserItemsRequestJson {
      authToken: JSON
      user: JSON
      lastItem: JSON
      pageSize: number
    }
    const jsonObject: LoadMoreUserItemsRequestJson = 
      json as unknown as LoadMoreUserItemsRequestJson

    const deserializedToken = AuthToken.fromJson(
      JSON.stringify(jsonObject.authToken)
    )

    if (deserializedToken === null) {
      throw new Error(
        "LoadMoreUserItemsRequest, could not deserialize token with json:\n" +
          JSON.stringify(jsonObject.authToken)
      )
    }

    const deserializedUser = User.fromJson(
      JSON.stringify(jsonObject.user)
    )

    if (deserializedUser === null) {
      throw new Error(
        "LoadMoreUserItemsRequest, could not deserialize user with json:\n" +
          JSON.stringify(jsonObject.user)
      )
    }

    const deserializedLastItem = User.fromJson(
      jsonObject.lastItem ? JSON.stringify(jsonObject.lastItem) : null
    )

    return new LoadMoreUserItemsRequest(
      deserializedToken,
      deserializedUser,
      deserializedLastItem,
      jsonObject.pageSize
    )
  }
}

export class PostStatusRequest extends TweeterRequest {
  authToken: AuthToken
  newStatus: Status

  constructor(authToken: AuthToken, newStatus: Status) {
    super()
    this.authToken = authToken
    this.newStatus = newStatus
  }

  static fromJSON(json: JSON): PostStatusRequest {
    interface PostStatusRequestJson {
      authToken: JSON
      newStatus: JSON
    }
    const jsonObject: PostStatusRequestJson = 
      json as unknown as PostStatusRequestJson

    const deserializedToken = AuthToken.fromJson(
      JSON.stringify(jsonObject.authToken)
    )

    if (deserializedToken === null) {
      throw new Error(
        "PostStatusRequest, could not deserialize token with json:\n" +
          JSON.stringify(jsonObject.authToken)
      )
    }

    const deserializedStatus = Status.fromJson(
      JSON.stringify(jsonObject.newStatus)
    )

    if (deserializedStatus === null) {
      throw new Error(
        "PostStatusRequest, could not deserialize status with json:\n" +
          JSON.stringify(jsonObject.newStatus)
      )
    }

    return new PostStatusRequest(
      deserializedToken,
      deserializedStatus
    )
  }
}

export class GetIsFollowerStatusRequest extends TweeterRequest {
  authToken: AuthToken
  user: User
  selectedUser: User

  constructor(authToken: AuthToken, user: User, selectedUser: User) {
    super()
    this.authToken = authToken
    this.user = user
    this.selectedUser = selectedUser
  }

  static fromJSON(json: JSON): GetIsFollowerStatusRequest {
    interface GetIsFollowerStatusRequestJson {
      authToken: JSON
      user: JSON
      selectedUser: JSON
    }
    const jsonObject: GetIsFollowerStatusRequestJson = 
      json as unknown as GetIsFollowerStatusRequestJson

    const deserializedToken = AuthToken.fromJson(
      JSON.stringify(jsonObject.authToken)
    )

    if (deserializedToken === null) {
      throw new Error(
        "GetIsFollowerStatusRequest, could not deserialize token with json:\n" +
          JSON.stringify(jsonObject.authToken)
      )
    }

    const deserializedUser = User.fromJson(
      JSON.stringify(jsonObject.user)
    )

    if (deserializedUser === null) {
      throw new Error(
        "GetIsFollowerStatusRequest, could not deserialize user with json:\n" +
          JSON.stringify(jsonObject.user)
      )
    }

    const deserializedSelectedUser = User.fromJson(
      JSON.stringify(jsonObject.selectedUser)
    )

    if (deserializedSelectedUser === null) {
      throw new Error(
        "GetIsFollowerStatusRequest, could not deserialize selectedUser with json:\n" +
          JSON.stringify(jsonObject.selectedUser)
      )
    }

    return new GetIsFollowerStatusRequest(
      deserializedToken,
      deserializedUser,
      deserializedSelectedUser
    )
  }
}

export class GetFollowsCountRequest extends TweeterRequest {
  authToken: AuthToken
  user: User

  constructor(authToken: AuthToken, user: User) {
    super()
    this.authToken = authToken
    this.user = user
  }

  static fromJSON(json: JSON): GetFollowsCountRequest {
    interface GetFollowsCountRequestJson {
      authToken: JSON
      user: JSON
    }
    const jsonObject: GetFollowsCountRequestJson = 
      json as unknown as GetFollowsCountRequestJson

    const deserializedToken = AuthToken.fromJson(
      JSON.stringify(jsonObject.authToken)
    )

    if (deserializedToken === null) {
      throw new Error(
        "GetFollowsCountRequest, could not deserialize token with json:\n" +
          JSON.stringify(jsonObject.authToken)
      )
    }

    const deserializedUser = User.fromJson(
      JSON.stringify(jsonObject.user)
    )

    if (deserializedUser === null) {
      throw new Error(
        "GetFollowsCountRequest, could not deserialize user with json:\n" +
          JSON.stringify(jsonObject.user)
      )
    }

    return new GetFollowsCountRequest(
      deserializedToken,
      deserializedUser
    )
  }
}

export class FollowActionRequest extends TweeterRequest {
  authToken: AuthToken
  userToActOn: User

  constructor(authToken: AuthToken, userToActOn: User) {
    super()
    this.authToken = authToken
    this.userToActOn = userToActOn
  }

  static fromJSON(json: JSON): FollowActionRequest {
    interface FollowActionRequestJson {
      authToken: JSON
      userToActOn: JSON
    }
    const jsonObject: FollowActionRequestJson = 
      json as unknown as FollowActionRequestJson

    const deserializedToken = AuthToken.fromJson(
      JSON.stringify(jsonObject.authToken)
    )

    if (deserializedToken === null) {
      throw new Error(
        "FollowActionRequest, could not deserialize token with json:\n" +
          JSON.stringify(jsonObject.authToken)
      )
    }

    const deserializedUserToActOn = User.fromJson(
      JSON.stringify(jsonObject.userToActOn)
    )

    if (deserializedUserToActOn === null) {
      throw new Error(
        "FollowActionRequest, could not deserialize user with json:\n" +
          JSON.stringify(jsonObject.userToActOn)
      )
    }

    return new FollowActionRequest(
      deserializedToken,
      deserializedUserToActOn
    )
  }
}

