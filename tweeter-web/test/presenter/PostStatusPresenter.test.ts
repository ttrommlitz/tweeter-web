import { AuthToken, User } from "tweeter-shared";
import { PostStatusPresenter, PostStatusView } from "../../src/presenter/PostStatusPresenter";
import { anything, capture, instance, mock, spy, verify, when } from "ts-mockito";
import { StatusService } from "../../src/service/StatusService";

describe("PostStatusPresenter", () => {
  let mockPostStatusView: PostStatusView;
  let postStatusPresenter: PostStatusPresenter;
  let mockStatusService: StatusService;

  const user = new User("first", "last", "alias", "imageUrl");
  const authToken = new AuthToken("token", Date.now());

  beforeEach(() => {
    mockPostStatusView = mock<PostStatusView>();
    const mockPostStatusViewInstance = instance(mockPostStatusView);

    const postStatusPresenterSpy = spy(new PostStatusPresenter(mockPostStatusViewInstance));
    postStatusPresenter = instance(postStatusPresenterSpy);

    mockStatusService = mock<StatusService>();
    const mockStatusServiceInstance = instance(mockStatusService);

    when(postStatusPresenterSpy.statusService).thenReturn(mockStatusServiceInstance);
  });

  it("tells the view to display a posting status message", async () => {
    await postStatusPresenter.submitPost("post", user, authToken);
    verify(mockPostStatusView.displayInfoMessage("Posting status...", 0)).once();
  });

  it("calls postStatus on the status service with the correct status string and auth token", async () => {
    await postStatusPresenter.submitPost("post", user, authToken);
    verify(mockStatusService.postStatus(anything(), anything())).once();

    const [token, status] = capture(mockStatusService.postStatus).last();
    expect(token).toEqual(authToken);
    expect(status.post).toEqual("post");
  });

  it("tells the view to clear the last info message, clear the post, and display a status posted message when posting is successful", async () => {
    await postStatusPresenter.submitPost("post", user, authToken);
    verify(mockPostStatusView.clearLastInfoMessage()).once();
    verify(mockPostStatusView.setPost("")).once();
    verify(mockPostStatusView.displayInfoMessage("Status posted!", 2000)).once();
  });

  it("displays an error message and does not clear the last info message, clear the post, or display a status posted message when posting fails", async () => {
    const error = new Error("An error occurred");
  
    when(mockStatusService.postStatus(anything(), anything())).thenThrow(error);

    await postStatusPresenter.submitPost("post", user, authToken);
    verify(mockPostStatusView.displayErrorMessage("Failed to post the status because of exception: An error occurred")).once();
    verify(mockPostStatusView.clearLastInfoMessage()).never();
    verify(mockPostStatusView.setPost("")).never();
    verify(mockPostStatusView.displayInfoMessage("Status Posted!", 2000)).never();
  });
});