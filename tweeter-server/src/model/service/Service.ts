import { AuthToken } from "tweeter-shared";
import { AuthtokenDaoInterface } from "../../dao/AuthtokenDao";
import { FeedDaoInterface } from "../../dao/FeedDao";
import { FollowsDaoInterface } from "../../dao/FollowsDao";
import { S3DaoInterface } from "../../dao/S3Dao";
import { StoryDaoInterface } from "../../dao/StoryDao";
import { UserDaoInterface } from "../../dao/UserDao";
import { FactoryInterface } from "./Factory";

export class Service {
  protected authTokenDao: AuthtokenDaoInterface;
  protected followsDao: FollowsDaoInterface;
  protected userDao: UserDaoInterface;
  protected s3Dao: S3DaoInterface;
  protected feedDao: FeedDaoInterface;
  protected storyDao: StoryDaoInterface;

  constructor(factory: FactoryInterface) {
    this.authTokenDao = factory.createAuthTokenDao();
    this.followsDao = factory.createFollowsDao();
    this.userDao = factory.createUserDao();
    this.s3Dao = factory.createS3Dao();
    this.feedDao = factory.createFeedDao();
    this.storyDao = factory.createStoryDao();
  }

  private refreshToken = async (token: AuthToken): Promise<void> => {
    await this.authTokenDao.updateAuthtoken(token);
  }

  protected async verifyToken(token: AuthToken): Promise<void> {
    let badToken = false
    const authToken = await this.authTokenDao.getAuthtoken(token);
    if (authToken === null) {
      badToken = true;
    } else if (authToken.timestamp < Date.now()) {
      await this.authTokenDao.deleteAuthtoken(token);
      badToken = true;
    } else {
      await this.refreshToken(token);
    }
    
    if (badToken) {
      throw new Error("Invalid token. Log in again.");
    }
  }
}