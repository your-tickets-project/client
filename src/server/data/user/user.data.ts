// database
import { dbInsert, dbSelect } from 'server/database';
// interfaces
import { UserType } from 'interfaces';
// utils
import { hashPassword, verifyPassword } from 'server/utils';
// validations
import { LoginDtoType, SigninDtoType } from 'server/validations/auth';

export const create = async ({ data }: { data: SigninDtoType }) => {
  const user = await findByEmail({ email: data.email! });
  if (user) {
    throw new Error('This email is already being used');
  }

  data.password = await hashPassword({ password: data.password! });
  return dbInsert({ query: 'INSERT INTO user SET ?;', data });
};

export const findByEmail = async ({ email }: { email: string }) => {
  const data = await dbSelect({
    query: 'SELECT * FROM user WHERE email = ?;',
    queryValues: [email],
  });

  return data[0] as UserType;
};

export const login = async ({ data }: { data: LoginDtoType }) => {
  const user = await findByEmail({ email: data.email! });

  if (!user) {
    throw new Error('Invalid email or password');
  }

  const isCorrectPassword = await verifyPassword({
    password: data.password!,
    hash: user.password!,
  });
  if (!isCorrectPassword) {
    throw new Error('Invalid email or password');
  }

  return user;
};

export const findById = async ({ id }: { id: string | number }) => {
  const data = await dbSelect({
    query: 'SELECT * FROM user WHERE id = ?;',
    queryValues: [id],
  });

  return data[0] as UserType;
};
