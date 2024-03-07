export interface View {
  displayErrorMessage: (message: string) => void;
}

export interface MessageView extends View {
  displayInfoMessage: (message: string, duration: number, bootstrapClasses?: string | undefined) => void;
  clearLastInfoMessage: () => void;
}

export class Presenter {
  private _view: View;

  protected constructor(view: View) {
    this._view = view;
  }

  protected get view(): View {
    return this._view
  }

  public async doFailureReportingOperation(operation: () => Promise<void>, operationDescription: string): Promise<void> {
    try {
      await operation();
    } catch (error) {
      this.view.displayErrorMessage(
        `Failed to ${operationDescription} because of exception: ${(error as Error).message}`
      );
    }
  };
}