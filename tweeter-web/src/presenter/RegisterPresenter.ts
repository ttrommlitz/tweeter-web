import { AuthToken, User } from "tweeter-shared";
import { UserService } from "../service/UserService";
import { Buffer } from "buffer";

export interface RegisterView {
  setImageUrl(url: string): void;
  setImageBytes(bytes: Uint8Array): void;
  updateUserInfo(
    currentUser: User,
    displayedUser: User,
    authToken: AuthToken,
  ): void;
  navigate(path: string): void;
  displayErrorMessage(message: string): void;
}

export class RegisterPresenter {
  private view: RegisterView;
  private userService: UserService;

  public constructor(view: RegisterView) {
    this.view = view;
    this.userService = new UserService();
  }

  public handleImageFile(file: File | undefined) {
    if (file) {
      this.view.setImageUrl(URL.createObjectURL(file));

      const reader = new FileReader();
      reader.onload = (event: ProgressEvent<FileReader>) => {
        const imageStringBase64 = event.target?.result as string;

        // Remove unnecessary file metadata from the start of the string.
        const imageStringBase64BufferContents =
          imageStringBase64.split("base64,")[1];

        const bytes: Uint8Array = Buffer.from(
          imageStringBase64BufferContents,
          "base64"
        );

        this.view.setImageBytes(bytes);
      };
      reader.readAsDataURL(file);
    } else {
      this.view.setImageUrl("");
      this.view.setImageBytes(new Uint8Array());
    }
  };

  public async doRegister(
    firstName: string,
    lastName: string,
    alias: string,
    password: string,
    imageBytes: Uint8Array) {
    try {
      let [user, authToken] = await this.userService.register(
        firstName,
        lastName,
        alias,
        password,
        imageBytes
      );

      this.view.updateUserInfo(user, user, authToken);
      this.view.navigate("/");
    } catch (error) {
      this.view.displayErrorMessage(
        `Failed to register user because of exception: ${error}`
      );
    }
  };
}