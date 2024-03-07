import { AuthToken } from "tweeter-shared";
import { AppNavbarPresenter, AppNavbarView } from "../../src/presenter/AppNavbarPresenter";
import { anything, capture, instance, mock, spy, verify, when } from "ts-mockito";
import { UserService } from "../../src/service/UserService";

describe("AppNavBarPresenter", () => {
  let mockAppNavbarView: AppNavbarView;
  let appNavBarPresenter: AppNavbarPresenter;
  let mockUserService: UserService;

  const authToken = new AuthToken("token", Date.now());

  beforeEach(() => {
    mockAppNavbarView = mock<AppNavbarView>();
    const mockAppNavbarViewInstance = instance(mockAppNavbarView);

    const appNavBarPresenterSpy = spy(new AppNavbarPresenter(mockAppNavbarViewInstance));
    appNavBarPresenter = instance(appNavBarPresenterSpy);

    mockUserService = mock<UserService>();
    const mockUserServiceInstance = instance(mockUserService);

    when(appNavBarPresenterSpy.userService).thenReturn(mockUserServiceInstance);
  });

  it("tells the view to display a logging out message", async () => {
    await appNavBarPresenter.logOut(authToken);
    verify(mockAppNavbarView.displayInfoMessage("Logging Out...", 0)).once();
  });

  it("calls logout on the user service with the correct auth token", async () => {
    await appNavBarPresenter.logOut(authToken);
    verify(mockUserService.logout(authToken)).once();
  });

  it("tells the view to clear the last info message, clear the user info, and navigate to the login page when logout is successful", async () => {
    await appNavBarPresenter.logOut(authToken);
    verify(mockAppNavbarView.clearLastInfoMessage()).once();
    verify(mockAppNavbarView.clearUserInfo()).once();
    verify(mockAppNavbarView.displayErrorMessage(anything())).never();
  });

  it("displays an error message and does not clear the last info message, clear the user info, or navigate to the login page when logout fails", async () => {
    const error = new Error("An error occurred");
  
    when(mockUserService.logout(authToken)).thenThrow(error);
    await appNavBarPresenter.logOut(authToken);
    verify(mockAppNavbarView.displayErrorMessage("Failed to log user out because of exception: An error occurred")).once();
    verify(mockAppNavbarView.clearLastInfoMessage()).never();
    verify(mockAppNavbarView.clearUserInfo()).never();
  });
});