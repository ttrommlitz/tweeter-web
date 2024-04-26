import { AuthToken, User } from "tweeter-shared";
import { FollowService } from "../service/FollowService";
import { MessageView, Presenter, View } from "./Presenter";

export interface UserInfoView extends MessageView {
  setIsFollower: (isFollower: boolean) => void;
  setFolloweesCount: (count: number) => void;
  setFollowersCount: (count: number) => void;
}

export class UserInfoPresenter extends Presenter {
  private followService: FollowService;

  public constructor(view: UserInfoView) {
    super(view);
    this.followService = new FollowService();
  }

  protected get view(): UserInfoView {
    return super.view as UserInfoView;
  }

  public async setIsFollowerStatus (
    authToken: AuthToken,
    currentUser: User,
    displayedUser: User
  ) {
    await this.doFailureReportingOperation(async () => {
      if (currentUser === displayedUser) {
        this.view.setIsFollower(false);
      } else {
        this.view.setIsFollower(
          await this.followService.getIsFollowerStatus(authToken!, currentUser!, displayedUser!)
        );
      }
    }, "determine follower status");
  };

  public async setNumbFollowees (
    authToken: AuthToken,
    displayedUser: User
  ) {
    await this.doFailureReportingOperation(async () => {
      this.view.setFolloweesCount(
        await this.followService.getFolloweesCount(authToken, displayedUser)
      );
    }, "get followees count");
  };

  public async setNumbFollowers (
    authToken: AuthToken,
    displayedUser: User
  ) {
    await this.doFailureReportingOperation(async () => {
      this.view.setFollowersCount(
        await this.followService.getFollowersCount(authToken, displayedUser)
      );
    }, "get followers count");
  };

  public async followDisplayedUser(authToken: AuthToken, currentUser: User, displayedUser: User) {
    await this.doFailureReportingOperation(async () => {
      this.view.displayInfoMessage(`Adding ${displayedUser!.name} to followers...`, 0);

      let [followersCount, followeesCount] = await this.followService.follow(
        authToken!,
        currentUser!,
        displayedUser!
      );

      this.view.clearLastInfoMessage();

      this.view.setIsFollower(true);
      this.view.setFollowersCount(followersCount);
      this.view.setFolloweesCount(followeesCount);
    }, "follow user");
  };
 
  public async unfollowDisplayedUser(authToken: AuthToken, currentUser: User, displayedUser: User) {
    await this.doFailureReportingOperation(async () => {
      this.view.displayInfoMessage(
        `Removing ${displayedUser!.name} from followers...`,
        0
      );

      let [followersCount, followeesCount] = await this.followService.unfollow(
        authToken!,
        currentUser!,
        displayedUser!
      );

      this.view.clearLastInfoMessage();

      this.view.setIsFollower(false);
      this.view.setFollowersCount(followersCount);
      this.view.setFolloweesCount(followeesCount);
    }, "unfollow user");
  }; 
}