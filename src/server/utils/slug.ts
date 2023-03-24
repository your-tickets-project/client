import slugify from 'slugify';

interface Param {
  string: string;
  options?: {
    replacement?: string;
    remove?: RegExp;
    lower?: boolean;
    strict?: boolean;
    locale?: string;
    trim?: boolean;
  };
}

export const slug = ({ string, options }: Param) => slugify(string, options);
