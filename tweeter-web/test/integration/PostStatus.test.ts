import 'isomorphic-fetch'
import { ServerFacade } from '../../src/network/ServerFacade'
import { LoadMoreStatusItemsRequest, LoginRequest } from 'tweeter-shared'
import { instance, mock, verify } from 'ts-mockito'
import { PostStatusPresenter, PostStatusView } from '../../src/presenter/PostStatusPresenter'

describe('PostStatus Operation', () => {
  it('correctly appends a new status to the user\'s story', async () => {
    const mockPostStatusView: PostStatusView = mock<PostStatusView>();

    // log user in
    const loginRequest = new LoginRequest('@ttromm', 'password')
    const loginResponse = await new ServerFacade().login(loginRequest)

    // post a new status on presenter
    const presenter = new PostStatusPresenter(instance(mockPostStatusView))
    await presenter.submitPost('hello world', loginResponse.user, loginResponse.token)

    // verify that successfully posted toast message is displayed

    verify(mockPostStatusView.displayInfoMessage("Status posted!", 2000)).once()

    // retrieve the user's story
    const loadMoreStatusItemsRequest = new LoadMoreStatusItemsRequest(loginResponse.token, loginResponse.user, null, 30)
    const userStory = await new ServerFacade().loadMoreStoryItems(loadMoreStatusItemsRequest)

    const latestStatus = userStory.statusItems[userStory.statusItems.length - 1]

    expect(latestStatus.post).toBe('hello world')
    expect(latestStatus.user.alias).toBe('@ttromm')
  })
})