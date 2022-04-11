/**
 * Check if a supplied objectt is empty.
 *
 * @param obj
 * @returns 
 */
export const isEmpty = (obj: object) => {
  return obj && Object.keys(obj).length === 0;
};

/**
 * Process an error message from a try / catch.
 * 
 * @param error
 * @returns 
 */
export const getErrorMessage = (error: unknown) => {
  let message;
  if (error instanceof Error) {
    message = error.message;
  } else {
    message = String(error);
  }
  return message;
};

export const fetcher = (url: string) => fetch(url).then((res) => res.json());