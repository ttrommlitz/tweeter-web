import { AuthenticationPresenter, AuthenticationView } from "./AuthenticationPresenter";

export interface LoginView extends AuthenticationView {}

export class LoginPresenter extends AuthenticationPresenter {
  public async doLogin(alias: string, password: string, originalUrl?: string) {
    this.doAuthenticationOperation(
      async () => {
        return this.service.login(alias, password);
    }, () => {
      // renders the index or originalUrl page
    if (!!originalUrl) {
      this.view.navigate(originalUrl);
    } else {
      this.view.navigate("/");
    }
    });
  };

  protected getAuthenticationDescription(): string {
    return "log user in";
  }
}