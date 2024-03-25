import { FollowActionRequest } from "tweeter-shared";
import { TweeterResponse } from "tweeter-shared/dist/model/net/Response";
import { FollowService } from "../model/service/FollowService";

exports.handler = async (event: JSON): Promise<TweeterResponse> => {
  console.log('EVENT: ', event)

  const request: FollowActionRequest = FollowActionRequest.fromJSON(event);
  let response: TweeterResponse

  try {
    await new FollowService().unfollow(request.authToken, request.userToActOn)
    response = new TweeterResponse(true);
  } catch (error) {
    throw new Error(`[400] ${error}`);
  }

  return response;
}