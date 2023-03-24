export const stringToHTML = (str: string) =>
  new DOMParser().parseFromString(str, 'text/html').body;
