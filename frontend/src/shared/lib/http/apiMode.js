export const delay = (milliseconds) => new Promise((resolve) => setTimeout(resolve, milliseconds));

export function shouldFallbackToMock(error) {
  const status = error?.response?.status;
  return !status || status === 404 || status === 405 || status >= 500;
}
