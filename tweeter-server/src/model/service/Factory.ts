import { AuthtokenDao, AuthtokenDaoInterface } from "../../dao/AuthtokenDao";
import { FeedDao, FeedDaoInterface } from "../../dao/FeedDao";
import { FollowsDaoInterface, FollowsDao } from "../../dao/FollowsDao";
import { S3DaoInterface, S3Dao } from "../../dao/S3Dao";
import { StoryDao, StoryDaoInterface } from "../../dao/StoryDao";
import { UserDaoInterface, UserDao } from "../../dao/UserDao";

export interface FactoryInterface {
  createUserDao(): UserDaoInterface;
  createS3Dao(): S3DaoInterface;
  createFollowsDao(): FollowsDaoInterface;
  createFeedDao(): FeedDaoInterface;
  createStoryDao(): StoryDaoInterface;
  createAuthTokenDao(): AuthtokenDaoInterface;
}

export class Factory implements FactoryInterface {
  createUserDao(): UserDaoInterface {
    return new UserDao();
  }

  createS3Dao(): S3DaoInterface {
    return new S3Dao();
  }

  createFollowsDao(): FollowsDaoInterface {
    return new FollowsDao();
  }

  createFeedDao(): FeedDaoInterface {
    return new FeedDao();
  }

  createStoryDao(): StoryDaoInterface {
    return new StoryDao();
  }

  createAuthTokenDao(): AuthtokenDaoInterface {
    return new AuthtokenDao();
  }
}