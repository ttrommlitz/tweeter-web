import { LogoutRequest } from "tweeter-shared";
import { TweeterResponse } from "tweeter-shared/dist/model/net/Response";
import { UserService } from "../model/service/UserService";

exports.handler = async (event: JSON): Promise<TweeterResponse> => {
  console.log('EVENT: ', event)

  const request: LogoutRequest = LogoutRequest.fromJSON(event);
  let response: TweeterResponse;

  try {
    await new UserService().logout(request.authToken)
    response = new TweeterResponse(true);
  } catch (error) {
    throw new Error(`[400] bad request: ${error}`);
  }

  return response;
}