import { AuthenticateResponse, LoginRequest } from "tweeter-shared";
import { UserService } from "../model/service/UserService";

exports.handler = async (event: JSON): Promise<AuthenticateResponse> => {
  console.log("EVENT: ", event)

  const request: LoginRequest = LoginRequest.fromJSON(event)
  let response: AuthenticateResponse;

  try {
    const [user, token] = await new UserService().login(request.alias, request.password)
    response = new AuthenticateResponse(
      user, token, true
    );
  } catch (error) {
    throw new Error(`[400] ${error}`)
  }

  return response
}