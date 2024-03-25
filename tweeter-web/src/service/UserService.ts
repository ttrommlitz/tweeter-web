import { AuthToken, User, FakeData, LoginRequest, RegisterRequest, GetUserRequest, LogoutRequest } from "tweeter-shared";
import { Buffer } from "buffer";
import { ServerFacade } from "../network/ServerFacade"

export class UserService {
  private serverFacade: ServerFacade;

  constructor() {
    this.serverFacade = new ServerFacade();
  }

  public async register (
    firstName: string,
    lastName: string,
    alias: string,
    password: string,
    userImageBytes: Uint8Array
  ): Promise<[User, AuthToken]> {
    let imageStringBase64: string =
      Buffer.from(userImageBytes).toString("base64");

    const request = new RegisterRequest(firstName, lastName, alias, password, imageStringBase64);
    const response = await this.serverFacade.register(request);

    return [response.user, response.token];
  };

  public async login (
    alias: string,
    password: string
  ): Promise<[User, AuthToken]> {
    const request = new LoginRequest(alias, password);
    const response = await this.serverFacade.login(request);

    return [response.user, response.token];
  };

  public async logout(authToken: AuthToken): Promise<void> {
    const request = new LogoutRequest(authToken);
    await this.serverFacade.logout(request);
  };
  
  public async getUser (
    authToken: AuthToken,
    alias: string
  ): Promise<User | null> {
    const request = new GetUserRequest(alias, authToken);
    const response = await this.serverFacade.getUser(request);

    return response.user;
  };
}