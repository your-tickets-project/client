export const queryStringParams = <T>(str?: string) => {
  const urlString = new URLSearchParams(str?.split('?')[1]);
  return Object.fromEntries(urlString) as T;
};
