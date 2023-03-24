export const queryStringParams = ({ str }: { str?: string }) => {
  const urlString = new URLSearchParams(str);
  return Object.fromEntries(urlString);
};
