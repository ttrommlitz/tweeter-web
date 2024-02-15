import { AuthToken, User } from "tweeter-shared";
import { UserService } from "../service/UserService";
import { FollowService } from "../service/FollowService";

export interface UserInfoView {
  displayErrorMessage: (message: string) => void;
  displayInfoMessage: (message: string, duration: number, bootstrapClasses?: string | undefined) => void;
  clearLastInfoMessage: () => void;
  setIsFollower: (isFollower: boolean) => void;
  setFolloweesCount: (count: number) => void;
  setFollowersCount: (count: number) => void;
}

export class UserInfoPresenter {
  private view: UserInfoView;
  private followService: FollowService;

  public constructor(view: UserInfoView) {
    this.view = view;
    this.followService = new FollowService();
  }

  public async setIsFollowerStatus (
    authToken: AuthToken,
    currentUser: User,
    displayedUser: User
  ) {
    try {
      if (currentUser === displayedUser) {
        this.view.setIsFollower(false);
      } else {
        this.view.setIsFollower(
          await this.followService.getIsFollowerStatus(authToken!, currentUser!, displayedUser!)
        );
      }
    } catch (error) {
      this.view.displayErrorMessage(
        `Failed to determine follower status because of exception: ${error}`
      );
    }
  };

  public async setNumbFollowees (
    authToken: AuthToken,
    displayedUser: User
  ) {
    try {
      this.view.setFolloweesCount(
        await this.followService.getFolloweesCount(authToken, displayedUser)
      );
    } catch (error) {
      this.view.displayErrorMessage(
        `Failed to get followees count because of exception: ${error}`
      );
    }
  };

  public async setNumbFollowers (
    authToken: AuthToken,
    displayedUser: User
  ) {
    try {
      this.view.setFollowersCount(
        await this.followService.getFollowersCount(authToken, displayedUser)
      );
    } catch (error) {
      this.view.displayErrorMessage(
        `Failed to get followers count because of exception: ${error}`
      );
    }
  };

  public async followDisplayedUser(authToken: AuthToken, displayedUser: User) {
    try {
      this.view.displayInfoMessage(`Adding ${displayedUser!.name} to followers...`, 0);

      let [followersCount, followeesCount] = await this.followService.follow(
        authToken!,
        displayedUser!
      );

      this.view.clearLastInfoMessage();

      this.view.setIsFollower(true);
      this.view.setFollowersCount(followersCount);
      this.view.setFolloweesCount(followeesCount);
    } catch (error) {
      this.view.displayErrorMessage(
        `Failed to follow user because of exception: ${error}`
      );
    }
  };
 
  public async unfollowDisplayedUser(authToken: AuthToken, displayedUser: User) {
    try {
      this.view.displayInfoMessage(
        `Removing ${displayedUser!.name} from followers...`,
        0
      );

      let [followersCount, followeesCount] = await this.followService.unfollow(
        authToken!,
        displayedUser!
      );

      this.view.clearLastInfoMessage();

      this.view.setIsFollower(false);
      this.view.setFollowersCount(followersCount);
      this.view.setFolloweesCount(followeesCount);
    } catch (error) {
      this.view.displayErrorMessage(
        `Failed to unfollow user because of exception: ${error}`
      );
    }
  }; 
}