import { GetFollowersCountResponse, GetFollowsCountRequest } from "tweeter-shared";
import { FollowService } from "../model/service/FollowService";
import { Factory } from "../model/service/Factory";

exports.handler = async (event: JSON): Promise<GetFollowersCountResponse> => {
  console.log('EVENT: ', event)

  const request: GetFollowsCountRequest = GetFollowsCountRequest.fromJSON(event)
  let response: GetFollowersCountResponse

  try {
    const followersCount = await new FollowService(new Factory()).getFollowersCount(request.authToken, request.user)
  
    response = new GetFollowersCountResponse(followersCount, true)
  } catch (error) {
    throw new Error(`[400] ${error}`)
  }

  return response
}