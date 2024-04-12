import { PostStatusRequest } from "tweeter-shared";
import { TweeterResponse } from "tweeter-shared/dist/model/net/Response";
import { StatusService } from "../model/service/StatusService";
import { Factory } from "../model/service/Factory";

exports.handler = async (event: JSON): Promise<TweeterResponse> => {
  console.log('EVENT: ', event)

  const request: PostStatusRequest = PostStatusRequest.fromJSON(event);
  let response: TweeterResponse;

  try {
    await new StatusService(new Factory()).postStatus(request.authToken, request.newStatus)
    response = new TweeterResponse(true);
  } catch (error) {
    throw new Error(`[400] bad request: ${error}`);
  }

  return response;
}