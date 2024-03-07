import { MemoryRouter } from "react-router-dom";
import { render, screen } from '@testing-library/react'
import { userEvent } from "@testing-library/user-event";
import Login from "../../../../src/components/authentication/login/Login";
import React from "react";
import "@testing-library/jest-dom";
import { library } from "@fortawesome/fontawesome-svg-core";
import { fab } from "@fortawesome/free-brands-svg-icons";
import { LoginPresenter } from "../../../../src/presenter/LoginPresenter";
import { instance, mock, verify } from "ts-mockito";

library.add(fab);

const renderLogin = (originalUrl?: string, LoginPresenter?: LoginPresenter) => {
  return render(
  <MemoryRouter>
    {
    !!LoginPresenter
      ? <Login originalUrl={originalUrl} presenter={LoginPresenter} /> 
      : <Login originalUrl={originalUrl} />
    }
  </MemoryRouter>)
}

const getLoginElements = (originalUrl?: string, LoginPresenter?: LoginPresenter) => {
  const user = userEvent.setup();

  renderLogin(originalUrl, LoginPresenter);

  const signInButton = screen.getByRole("button", { name: "Sign in"});
  const aliasField = screen.getByLabelText("alias");
  const passwordField = screen.getByLabelText("password");

  return {
    signInButton,
    aliasField,
    passwordField,
    user
  }
}

describe("Login Component", () => {
  it("starts with the sign in button disabled", () => {
    const { signInButton } = getLoginElements();
    expect(signInButton).toBeDisabled();
  })

  it("enables the sign in button if both the alias and password fields have text", async () => {
    const { signInButton, aliasField, passwordField, user } = getLoginElements();
    await user.type(aliasField, "alias");
    await user.type(passwordField, "password");
    expect(signInButton).toBeEnabled();
  })

  it("disables the sign in button if either field is cleared", async () => {
    const { signInButton, aliasField, passwordField, user } = getLoginElements();
    await user.type(aliasField, "alias");
    await user.type(passwordField, "password");
    expect(signInButton).toBeEnabled();

    await user.clear(aliasField);
    expect(signInButton).toBeDisabled();

    await user.type(aliasField, "alias");
    expect(signInButton).toBeEnabled();

    await user.clear(passwordField);
    expect(signInButton).toBeDisabled();
  });

  it("calls the presenter's doLogin method with correct parameters when the sign-in button is pressed", async () => {
    const mockLoginPresenter = mock<LoginPresenter>();
    const mockLoginPresenterInstance = instance(mockLoginPresenter);

    const originalUrl = "http://someurl.com";
    const alias = "alias";
    const password = "password";

    const { signInButton, aliasField, passwordField, user } = getLoginElements(originalUrl, mockLoginPresenterInstance);

    await user.type(aliasField, alias);
    await user.type(passwordField, password);

    await user.click(signInButton);

    verify(mockLoginPresenter.doLogin(alias, password, originalUrl)).once();
  });
})