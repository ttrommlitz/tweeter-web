// create my user, then create 50 users who all follow me and I follow them

import { AuthToken, FakeData, User } from "tweeter-shared";
import { UserService } from "./model/service/UserService";
import { Factory } from "./model/service/Factory";
import { FollowService } from "./model/service/FollowService";
import { genSalt, hash } from "bcryptjs";
import { UserDao } from "./dao/UserDao";
import { AuthtokenDao } from "./dao/AuthtokenDao";

const userDao = new UserDao()
const authTokenDao = new AuthtokenDao()
const userService = new UserService(new Factory())
const followService = new FollowService(new Factory())

const testRegister = async (firstName: string, lastName: string, alias: string, password: string, imageUrl: string): Promise<[User, AuthToken]> => {
  const user: User = new User(
    firstName,
    lastName,
    alias,
    imageUrl
  )
  
  const saltRounds = 10
  const salt = await genSalt(saltRounds)
  const hashedPassword = await hash(password, salt)

  await userDao.putUser(user, hashedPassword)

  const authToken = AuthToken.Generate()
  await authTokenDao.putAuthtoken(authToken)

  return [user, authToken];
}

const setup = async () => {


  const [mainUser, authToken] = await testRegister(
    "Tyler",
    "Trommlitz",
    "@ttromm",
    "pass",
    "https://faculty.cs.byu.edu/~jwilkerson/cs340/tweeter/images/donald_duck.png"
  )
  for (const fakeUser of FakeData.instance.getPageOfUsers(null, 25, null)[0]) { 
    const [otherUser, otherToken] = await testRegister(
      fakeUser.firstName,
      fakeUser.lastName,
      fakeUser.alias,
      "pass",
      fakeUser.imageUrl
    )

    // Follow the user
    // have the user follow me

    await followService.follow(authToken, mainUser, otherUser)
    await followService.follow(otherToken, otherUser, mainUser)
  }

  const [extraFollower, extraToken] = await testRegister(
    "Aaron",
    "Aardvark",
    "@aardvark",
    "pass",
    "https://faculty.cs.byu.edu/~jwilkerson/cs340/tweeter/images/donald_duck.png"
  )

    await followService.follow(authToken, extraFollower, mainUser)
}

setup().then(() => console.log("Setup complete"))