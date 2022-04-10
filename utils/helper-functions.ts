/**
 * Check if a supplied objectt is empty.
 *
 * @param obj
 * @returns 
 */
export const isEmpty = (obj: object) => {
  return obj && Object.keys(obj).length === 0;
};
