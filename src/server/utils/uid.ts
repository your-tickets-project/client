import { nanoid, customAlphabet } from 'nanoid';

export const generateId = (size?: number) => nanoid(size);

export const generateNumberId = ({
  maxSize,
  minSize,
  size,
}: {
  maxSize?: number;
  minSize?: number;
  size?: number;
}): number => {
  // if (maxSize && minSize) {
  //   size = Math.floor(Math.random() * (maxSize - minSize)) + minSize;
  // }
  const id = customAlphabet('1234567890', size)();
  if (id.startsWith('0')) {
    return generateNumberId({ maxSize, minSize });
  }
  return +id;
};
