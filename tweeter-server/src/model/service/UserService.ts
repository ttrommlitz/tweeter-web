import { User, AuthToken } from "tweeter-shared";
import { hash, genSalt } from "bcryptjs";
import { FactoryInterface } from "./Factory";
import { isValidPassword } from "./helpers";
import { Service } from "./Service";

export class UserService extends Service {
  constructor(factory: FactoryInterface) {
    super(factory);
  }
  
  public async register (
    firstName: string,
    lastName: string,
    alias: string,
    password: string,
    imageStringBase64: string
  ): Promise<[User, AuthToken]> {
    const imageUrl = await this.s3Dao.uploadImage(alias, imageStringBase64)

    const user: User = new User(
      firstName,
      lastName,
      alias,
      imageUrl
    )
    
    const saltRounds = 10
    const salt = await genSalt(saltRounds)
    const hashedPassword = await hash(password, salt)

    await this.userDao.putUser(user, hashedPassword)

    const authToken = AuthToken.Generate()
    await this.authTokenDao.putAuthtoken(authToken)

    // if (user === null) {
    //   throw new Error("Invalid registration");
    // }

    return [user, authToken];
  };

  public async login (
    alias: string,
    password: string
  ): Promise<[User, AuthToken]> {
    const user = await this.userDao.getUser(alias)
    const hashedPassword = await this.userDao.getHashedPassword(alias)

    const correctPassword = await isValidPassword(password, hashedPassword)
    if (user === null || !correctPassword) {
      throw new Error("Invalid alias or password");
    }

    const authToken = AuthToken.Generate()
    await this.authTokenDao.putAuthtoken(authToken)

    return [user, authToken];
  };

  public async logout(authToken: AuthToken): Promise<void> {
    await this.verifyToken(authToken)
    
    await this.authTokenDao.deleteAuthtoken(authToken)
  };

  public async getUser (
    authToken: AuthToken,
    alias: string
  ): Promise<User | null> {
    await this.verifyToken(authToken)

    const user = await this.userDao.getUser(alias)
    return user
  };
}