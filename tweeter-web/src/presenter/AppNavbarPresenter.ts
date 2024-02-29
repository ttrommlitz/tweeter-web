import { AuthToken } from "tweeter-shared";
import { UserService } from "../service/UserService";
import { MessageView, Presenter, View } from "./Presenter";

export interface AppNavbarView extends MessageView {
  clearUserInfo: () => void;
}

export class AppNavbarPresenter extends Presenter {
  private userService: UserService;

  public constructor(view: AppNavbarView) {
    super(view);
    this.userService = new UserService();
  }
  
  protected get view(): AppNavbarView {
    return super.view as AppNavbarView;
  }

  public async logOut(authToken: AuthToken) {
    this.view.displayInfoMessage("Logging Out...", 0);

    this.doFailureReportingOperation(async () => {
      await this.userService.logout(authToken!);

      this.view.clearLastInfoMessage();
      this.view.clearUserInfo();
    }, "log user out");
  };
}