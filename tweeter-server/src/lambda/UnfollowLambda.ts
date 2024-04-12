import { FollowActionRequest } from "tweeter-shared";
import { TweeterResponse } from "tweeter-shared/dist/model/net/Response";
import { FollowService } from "../model/service/FollowService";
import { Factory } from "../model/service/Factory";

exports.handler = async (event: JSON): Promise<TweeterResponse> => {
  console.log('EVENT: ', event)

  const request: FollowActionRequest = FollowActionRequest.fromJSON(event);
  let response: TweeterResponse

  try {
    await new FollowService(new Factory()).unfollow(request.authToken, request.currentUser, request.userToActOn)
    response = new TweeterResponse(true);
  } catch (error) {
    throw new Error(`[400] ${error}`);
  }

  return response;
}