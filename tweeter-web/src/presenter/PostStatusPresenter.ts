import { AuthToken, Status, User } from "tweeter-shared";
import { StatusService } from "../service/StatusService";
import { MessageView, Presenter, View } from "./Presenter";

export interface PostStatusView extends MessageView {
  setPost: (post: string) => void;
}

export class PostStatusPresenter extends Presenter {
  private _statusService: StatusService;

  public constructor(view: PostStatusView) {
    super(view);
    this._statusService = new StatusService();
  }

  protected get view(): PostStatusView {
    return super.view as PostStatusView;
  }

  public get statusService(): StatusService {
    return this._statusService;
  }

  public async submitPost(post: string, currentUser: User, authToken: AuthToken) {
    await this.doFailureReportingOperation(async () => {
      this.view.displayInfoMessage("Posting status...", 0);

      let status = new Status(post, currentUser, Date.now());

      await this.statusService.postStatus(authToken!, status);

      this.view.clearLastInfoMessage();
      this.view.setPost("");
      this.view.displayInfoMessage("Status posted!", 2000);
    }, "post the status");
  };
}