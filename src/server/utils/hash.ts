import bcrypt from 'bcrypt';

export const hashPassword = ({
  password,
  salt = 10,
}: {
  password: string;
  salt?: number;
}) => bcrypt.hash(password, salt);

export const verifyPassword = ({
  password,
  hash,
}: {
  password: string;
  hash: string;
}) => bcrypt.compare(password, hash);
