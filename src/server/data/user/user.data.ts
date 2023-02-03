// database
import { dbInsert, dbSelect } from 'server/database';
// exceptions
import { BadRequestException } from 'server/exceptions';
// interfaces
import { UserType } from 'interfaces';
// utils
import { hashPassword, verifyPassword } from 'server/utils';
// validations
import { LoginDtoType, SigninDtoType } from 'server/validations/auth';

export const createUser = async ({ data }: { data: SigninDtoType }) => {
  const user = await findUserByEmail({ email: data.email! });
  if (user) {
    throw new BadRequestException('This email is already being used');
  }

  data.password = await hashPassword({ password: data.password! });
  return dbInsert({ query: 'INSERT INTO user SET ?;', data });
};

export const findUserByEmail = async ({ email }: { email: string }) => {
  const data = await dbSelect({
    query: 'SELECT * FROM user WHERE email = ?;',
    queryValues: [email],
  });

  return data[0] as UserType | undefined;
};

export const login = async ({ data }: { data: LoginDtoType }) => {
  const user = await findUserByEmail({ email: data.email! });

  if (!user) {
    throw new BadRequestException('Invalid email or password');
  }

  const isCorrectPassword = await verifyPassword({
    password: data.password!,
    hash: user.password!,
  });
  if (!isCorrectPassword) {
    throw new BadRequestException('Invalid email or password');
  }

  return user;
};

export const findUserById = async ({ id }: { id: string | number }) => {
  const data = await dbSelect({
    query: 'SELECT * FROM user WHERE id = ?;',
    queryValues: [id],
  });

  return data[0] as UserType | undefined;
};
