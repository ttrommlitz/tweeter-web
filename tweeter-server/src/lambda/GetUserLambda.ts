import { GetUserRequest, GetUserResponse } from "tweeter-shared";
import { UserService } from "../model/service/UserService";
import { Factory } from "../model/service/Factory";

exports.handler = async (event: JSON): Promise<GetUserResponse> => {
  console.log("EVENT: ", event)

  const request: GetUserRequest = GetUserRequest.fromJSON(event);
  let response: GetUserResponse;

  try {
    const user = await new UserService(new Factory()).getUser(request.authToken, request.alias);

  if (!user) {
    response = new GetUserResponse(
      null, false, "User not found"
    );
  } else {
    response = new GetUserResponse(
      user, true
    );
  }

  return response;
  } catch (error) {
    throw new Error(`[400] ${error}`)
  }
}