import { useState } from "react";
import { UserNavigationHookPresenter, UserNavigationHookView } from "../../presenter/UserNavigationHookPresenter";
import useToastListener from "../toaster/ToastListenerHook";
import useUserInfo from "./UserInfoHook";

const useUserNavigation = () => {
  const { setDisplayedUser, currentUser, authToken } =
      useUserInfo();
  const { displayErrorMessage } = useToastListener();

  const listener: UserNavigationHookView = {
    setDisplayedUser,
    displayErrorMessage
  }

  const [presenter] = useState(new UserNavigationHookPresenter(listener));

  const navigateToUser = async (event: React.MouseEvent): Promise<void> => {
    event.preventDefault();

    presenter.navigateToUser(currentUser!, authToken!, event.target.toString());
  };

  return navigateToUser;
};

export default useUserNavigation;