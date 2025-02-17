/**
 * checks whether a value is one of enum values or not
 */
export function checkEnumOptionValidity<T>(enumType: any, value: T): boolean {
  let valueFound = false;
  for (const key of Object.keys(enumType)) {
    if (enumType[key] === value) {
      valueFound = true;
      break;
    }
  }
  return valueFound;
}
