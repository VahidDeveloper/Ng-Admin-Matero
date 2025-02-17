import { TemplateRef } from '@angular/core';

/** A class for wizard modal steps */
export class WizardStep {
  /** Constructor */
  constructor(template: TemplateRef<any>, name: string, key?: string, hasError?: () => boolean) {
    this.template = template;
    this.name = name;
    this.key = key;
    this.hasError = hasError;
  }
  /** template of the step */
  template: TemplateRef<any>;
  /** name of the step */
  name: string;
  /** key of the step */
  key?: string;
  /**
   * validate function gets run before moving to the next step
   * if the step was valid it will move forward to the next step
   */
  hasError?: () => boolean;
  /** it indicates when it has error. */
  error?: any;
  /** it indicates when the step has been met. */
  hasMet?: boolean;
}
