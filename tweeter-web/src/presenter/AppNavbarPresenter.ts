import { AuthToken } from "tweeter-shared";
import { UserService } from "../service/UserService";

export interface AppNavbarView {
  displayInfoMessage: (message: string, duration: number, bootstrapClasses?: string | undefined) => void;
  displayErrorMessage: (message: string) => void;
  clearLastInfoMessage: () => void;
  clearUserInfo: () => void;
}

export class AppNavbarPresenter {
  private view: AppNavbarView;
  private userService: UserService;

  public constructor(view: AppNavbarView) {
    this.view = view;
    this.userService = new UserService();
  }

  public async logOut(authToken: AuthToken) {
   this.view.displayInfoMessage("Logging Out...", 0);

    try {
      await this.userService.logout(authToken!);

      this.view.clearLastInfoMessage();
      this.view.clearUserInfo();
    } catch (error) {
      this.view.displayErrorMessage(
        `Failed to log user out because of exception: ${error}`
      );
    }
  };
}