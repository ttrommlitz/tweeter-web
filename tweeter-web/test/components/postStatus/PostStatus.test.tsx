import { render, screen } from "@testing-library/react";
import PostStatus from "../../../src/components/postStatus/PostStatus";
import React from "react";
import userEvent from "@testing-library/user-event";
import useUserInfo from "../../../src/components/userInfo/UserInfoHook";
import { instance, mock, verify } from "ts-mockito";
import { AuthToken, User } from "tweeter-shared";
import { PostStatusPresenter } from "../../../src/presenter/PostStatusPresenter";
import "@testing-library/jest-dom";

jest.mock("../../../src/components/userInfo/UserInfoHook", () => ({
  ...jest.requireActual("../../../src/components/userInfo/UserInfoHook"),
  __esModule: true,
  default: jest.fn(),
})); 

const renderPostStatus = (mockPostStatusPresenterInstance?: PostStatusPresenter) => {
  return render(<PostStatus presenter={mockPostStatusPresenterInstance} />);
}

const getPostStatusElements = (mockPostStatusPresenterInstance?: PostStatusPresenter) => {
  const user = userEvent.setup();
  renderPostStatus(mockPostStatusPresenterInstance);

  const postStatusButton = screen.getByRole("button", { name: "Post Status" });
  const clearButton = screen.getByRole("button", { name: "Clear" });
  const textField = screen.getByLabelText("Post Status");

  return {
    postStatusButton,
    clearButton,
    textField,
    user
  };
}

describe("PostStatus Component", () => {
  const mockUserInstance = instance(mock<User>());
  const mockAuthTokenInstance = instance(mock<AuthToken>());

  beforeAll(() => {
    (useUserInfo as jest.Mock).mockReturnValue({
      currentUser: mockUserInstance,
      authToken: mockAuthTokenInstance,
    });      
         
  });
  
  it("starts with the post status and clear buttons disabled", () => {
    const { postStatusButton, clearButton } = getPostStatusElements();
    expect(postStatusButton).toBeDisabled();
    expect(clearButton).toBeDisabled();
  });

  it("enables both buttons if the text field has text", async () => {
    const { postStatusButton, clearButton, textField, user } = getPostStatusElements();
    await user.type(textField, "Hello, world!");
    expect(postStatusButton).toBeEnabled();
    expect(clearButton).toBeEnabled();
  });

  it("disables both buttons if the text field is cleared", async () => {
    const { postStatusButton, clearButton, textField, user } = getPostStatusElements();
    await user.type(textField, "Hello, world!");
    expect(postStatusButton).toBeEnabled();
    expect(clearButton).toBeEnabled();

    await user.clear(textField);
    expect(postStatusButton).toBeDisabled();
    expect(clearButton).toBeDisabled();
  });

  it("calls the presenter's postStatus method with correct parameters when the post status button is pressed", async () => {
    const mockPostStatusPresenter = mock<PostStatusPresenter>();
    const mockPostStatusPresenterInstance = instance(mockPostStatusPresenter);

    const { postStatusButton, textField, user } = getPostStatusElements(mockPostStatusPresenterInstance);

    await user.type(textField, "Hello, world!");
    await user.click(postStatusButton);

    verify(mockPostStatusPresenter.submitPost("Hello, world!", mockUserInstance, mockAuthTokenInstance)).once();
  });
});