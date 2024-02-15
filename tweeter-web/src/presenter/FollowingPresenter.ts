import { AuthToken, User } from "tweeter-shared"
import { FollowService } from "../service/FollowService";
import { UserItemPresenter, UserItemView } from "./UserItemPresenter";

export const PAGE_SIZE = 10;

export class FollowingPresenter extends UserItemPresenter {
  private followService: FollowService;
  private lastItem: User | null = null;

  public constructor(view: UserItemView) {
    super(view);
    this.followService = new FollowService();
  }

  public async loadMoreItems(authToken: AuthToken, user: User) {
    try {
      if (this.hasMoreItems) {
        let [newItems, hasMore] = await this.followService.loadMoreFollowees(
          authToken!,
          user!,
          PAGE_SIZE,
          this.lastItem
        );

        this.hasMoreItems = hasMore;
        this.lastItem = newItems[newItems.length - 1];
        this.view.addItems(newItems);
      }
    } catch (error) {
      this.view.displayErrorMessage(
        `Failed to load followee because of exception: ${error}`
      );
    }
  };
}