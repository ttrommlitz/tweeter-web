import { AuthenticateResponse, RegisterRequest } from "tweeter-shared";
import { UserService } from "../model/service/UserService";
import { Factory } from "../model/service/Factory";

exports.handler = async (event: JSON): Promise<AuthenticateResponse> => {
  console.log("EVENT: ", event)

  const request: RegisterRequest = RegisterRequest.fromJSON(event)
  let response: AuthenticateResponse;

  try {
    const [user, token] = await new UserService(new Factory()).register(
      request.firstName,
      request.lastName,
      request.alias,
      request.password,
      request.imageStringBase64
    )
  
    response = new AuthenticateResponse(
      user, token, true
    );
  } catch (error) {
    throw new Error(`[400] ${error}`)
  }

  return response
}