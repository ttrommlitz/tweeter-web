import { GetIsFollowerStatusRequest, GetIsFollowerStatusResponse } from "tweeter-shared";
import { FollowService } from "../model/service/FollowService";
import { Factory } from "../model/service/Factory";

exports.handler = async (event: JSON): Promise<GetIsFollowerStatusResponse> => {
  console.log('EVENT: ', event)

  const request: GetIsFollowerStatusRequest = GetIsFollowerStatusRequest.fromJSON(event)
  let response: GetIsFollowerStatusResponse

  try {
    const isFollower = await new FollowService(new Factory()).getIsFollowerStatus(request.authToken, request.user, request.selectedUser)
  
    response = new GetIsFollowerStatusResponse(isFollower, true)
  } catch (error) {
    throw new Error(`[400] ${error}`)
  }

  return response
}