/**
 * it is used as configs for confirmation modal
 */
export class WizardConfigs {
  /**
   * CONSTRUCTOR
   */
  constructor(
    title?: string,
    cancelLabel?: string,
    submitLabel?: string,
    submitClass?: string,
    cancelClass?: string,
    nextButtonVisibility?: boolean,
    prevButtonVisibility?: boolean,
    disableStepClick?: boolean,
    isLoading?: boolean
  ) {
    this.title = title ?? `عنوان`;
    this.cancelLabel = cancelLabel ?? `لغو`;
    this.submitLabel = submitLabel ?? `ذخیره و پایان`;
    this.submitClass = submitClass ?? 'success';
    this.cancelClass = cancelClass ?? 'secondary';
    this.nextButtonVisibility = nextButtonVisibility ?? true;
    this.prevButtonVisibility = prevButtonVisibility ?? true;
    this.disableStepClick = disableStepClick ?? false;
    this.isLoading = isLoading ?? false;
  }

  /**
   * a title for modal
   */
  title: string;
  /**
   * class of submit button
   */
  submitClass?: string;
  /**
   * class of submit button
   */
  cancelClass?: string;
  /**
   * label for cancel button
   */
  cancelLabel?: string;
  /**
   * label for submit button
   */
  submitLabel?: string;

  nextButtonVisibility?: boolean;

  prevButtonVisibility?: boolean;

  disableStepClick?: boolean;

  isLoading?: boolean;
}
