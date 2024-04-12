import { GetFolloweesCountResponse, GetFollowsCountRequest } from "tweeter-shared";
import { FollowService } from "../model/service/FollowService";
import { Factory } from "../model/service/Factory";

exports.handler = async (event: JSON): Promise<GetFolloweesCountResponse> => {
  console.log('EVENT: ', event)

  const request: GetFollowsCountRequest = GetFollowsCountRequest.fromJSON(event)
  let response: GetFolloweesCountResponse

  try {
    const followeesCount = await new FollowService(new Factory()).getFolloweesCount(request.authToken, request.user)
  
    response = new GetFolloweesCountResponse(followeesCount, true)
  } catch (error) {
    throw new Error(`[400] ${error}`)
  }

  return response
}