/**
 * generic list item interface
 */
export interface GenericListItem<T = any> {
  /**
   * key of list item
   */
  key: T;
  /**
   * translated label for item
   */
  label: string;
  /**
   * a css class for showing icon in list of items
   */
  icon?: string;
  /**
   * a flag which indicates tha item is selected or not
   */
  selected?: boolean;
  /**
   * it is an arbitrary function to decide whether to show the button or not.
   * if it is null, the button should be shown without any condition.
   */
  displayFn?: (dataItem: any) => boolean;
}
