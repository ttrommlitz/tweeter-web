import { AuthToken, Status, User } from "tweeter-shared";
import { StatusService } from "../service/StatusService";

export interface PostStatusView {
  displayInfoMessage: (message: string, duration: number) => void;
  displayErrorMessage: (message: string) => void;
  clearLastInfoMessage: () => void;
  setPost: (post: string) => void;
}

export class PostStatusPresenter {
  private view: PostStatusView;
  private statusService: StatusService;

  public constructor(view: PostStatusView) {
    this.view = view;
    this.statusService = new StatusService();
  }

  public async submitPost(post: string, currentUser: User, authToken: AuthToken) {
    try {
      this.view.displayInfoMessage("Posting status...", 0);

      let status = new Status(post, currentUser, Date.now());

      await this.statusService.postStatus(authToken!, status);

      this.view.clearLastInfoMessage();
      this.view.setPost("");
      this.view.displayInfoMessage("Status posted!", 2000);
    } catch (error) {
      this.view.displayErrorMessage(
        `Failed to post the status because of exception: ${error}`
      );
    }
  };
}