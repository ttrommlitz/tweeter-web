import { User, AuthToken } from "tweeter-shared";
import { UserService } from "../service/UserService";
import { Presenter, View } from "./Presenter";

export interface UserNavigationHookView extends View {
  setDisplayedUser: (user: User) => void;
}

export class UserNavigationHookPresenter extends Presenter {
  private userService: UserService;

  public constructor(view: UserNavigationHookView) {
    super(view);
    this.userService = new UserService();
  }

  protected get view(): UserNavigationHookView {
    return super.view as UserNavigationHookView;
  }

  public async navigateToUser(currentUser: User, authToken: AuthToken, target: string): Promise<void> {
    await this.doFailureReportingOperation(async () => {
      let alias = this.extractAlias(target);

      let user = await this.userService.getUser(authToken!, alias);

      if (!!user) {
        if (currentUser!.equals(user)) {
          this.view.setDisplayedUser(currentUser!);
        } else {
          this.view.setDisplayedUser(user);
        }
      }
    }, "navigate to user");
  };

  private extractAlias(value: string): string {
    let index = value.indexOf("@");
    return value.substring(index);
  };
}