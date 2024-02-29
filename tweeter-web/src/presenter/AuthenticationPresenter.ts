import { AuthToken, User } from "tweeter-shared";
import { Presenter, View } from "./Presenter";
import { UserService } from "../service/UserService";

export interface AuthenticationView extends View {
  updateUserInfo(
    currentUser: User,
    displayedUser: User,
    authToken: AuthToken,
  ): void;
  navigate(path: string): void;
}
           
export abstract class AuthenticationPresenter extends Presenter {
  private _service: UserService;
  public constructor(view: AuthenticationView) {
    super(view);
    this._service = new UserService();
  }

  protected get service(): UserService {
    return this._service;
  }


  protected get view(): AuthenticationView {
    return super.view as AuthenticationView;
  }

  protected async doAuthenticationOperation(operation: () => Promise<[User, AuthToken]>, navigate: () => void) {
    this.doFailureReportingOperation(async () => {
      const [user, authToken] = await operation();
      this.view.updateUserInfo(user, user, authToken);
      navigate();
    }, this.getAuthenticationDescription());
  } 

  protected abstract getAuthenticationDescription(): string;
}