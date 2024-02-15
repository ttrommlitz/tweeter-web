import { AuthToken, User } from "tweeter-shared";
import { UserService } from "../service/UserService";

export interface LoginView {
  updateUserInfo: (currentUser: User, displayedUser: User, authToken: AuthToken) => void;
  navigate: (path: string) => void;
  displayErrorMessage: (message: string) => void;
}

export class LoginPresenter {
  private view: LoginView;
  private userService: UserService;

  public constructor(view: LoginView) {
    this.view = view;
    this.userService = new UserService();
  }

  public async doLogin(alias: string, password: string, originalUrl?: string) {
    try {
      let [user, authToken] = await this.userService.login(alias, password);

      this.view.updateUserInfo(user, user, authToken);

      // renders the index or originalUrl page
      if (!!originalUrl) {
        this.view.navigate(originalUrl);
      } else {
        this.view.navigate("/");
      }
    } catch (error) {
      this.view.displayErrorMessage(
        `Failed to log user in because of exception: ${error}`
      );
    }
  };
}