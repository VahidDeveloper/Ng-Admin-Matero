import { TemplateRef } from '@angular/core';

/**
 * It is used by key-value-list component.
 */
export class KeyWithCustomTemplate {
  constructor(
    key?: string,
    keyToDisplay?: string,
    customTemplate?: TemplateRef<any>,
    withoutDefaultClass?: boolean
  ) {
    this.key = key;
    this.keyToDisplay = keyToDisplay;
    this.customTemplate = customTemplate;
    this.withoutDefaultClass = withoutDefaultClass;
  }

  /**
   * The actual key name.
   */
  key: string | undefined;
  /**
   * the display of the key
   */
  keyToDisplay: string | undefined;
  /**
   * the custom template to show the value of the key.
   * if it is null, value would be row[key]
   * otherwise, it would be the specified template.
   */
  customTemplate?: TemplateRef<any>;
  /**
   * if it is true, no class is used for value container.
   * in default, it is false so a class is set to the value-container.
   */
  withoutDefaultClass?: boolean;
}
