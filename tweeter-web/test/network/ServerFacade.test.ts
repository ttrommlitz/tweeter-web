import { AuthToken, GetFollowsCountRequest, LoadMoreUserItemsRequest, RegisterRequest, User } from "tweeter-shared"
import { ServerFacade } from "../../src/network/ServerFacade"
import 'isomorphic-fetch'

describe('ServerFacade', () => {
  const serverFacade = new ServerFacade()
  const authToken = new AuthToken('token', Date.now())
  const user = new User('firstName', 'lastName', 'alias', 'imageStringBase64')
  it('should return a token when register is called', async () => {
    const request = new RegisterRequest('alias', 'password', 'firstName', 'lastName', 'imageStringBase64')
    const response = await serverFacade.register(request)

    expect(response.success).toBe(true)
    expect(response.message).toBeNull()
    expect(response.token).toBeDefined()
    expect(response.user).toBeDefined()
  })

  // it('should return followers when loadMoreFollowers is called', async () => {
  //   const PAGE_SIZE = 10
  //   let lastItem: User | null = null
  //   const request = new LoadMoreUserItemsRequest(authToken, user, lastItem, PAGE_SIZE)
  //   const response = await serverFacade.loadMoreFollowers(request)

  //   expect(response.success).toBe(true)
  //   expect(response.hasMoreItems).toBe(true)
  //   expect(response.users.length).toBeGreaterThan(0)
  //   expect(response.message).toBeNull()
  // })

  // it('should return the number of followers when getFollowersCount is called', async () => {
  //   const request = new GetFollowsCountRequest(authToken, user)
  //   const response = await serverFacade.getFollowersCount(request)

  //   expect(response.success).toBe(true)
  //   expect(response.message).toBeNull()
  //   expect(response.followersCount).toBeGreaterThan(0)
  // })

  // it('should return the number of followees when getFolloweesCount is called', async () => {
  //   const request = new GetFollowsCountRequest(authToken, user)
  //   const response = await serverFacade.getFolloweesCount(request)

  //   expect(response.success).toBe(true)
  //   expect(response.message).toBeNull()
  //   expect(response.followeesCount).toBeGreaterThan(0)
  // })
})