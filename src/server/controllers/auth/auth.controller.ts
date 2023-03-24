import { NextApiResponse } from 'next';
import { NextHandler } from 'next-connect';
import { NextApiRequestExtended } from 'server/router';
// data
import { createUser, login } from 'server/data/user/user.data';
// exceptions
import { BadRequestException } from 'server/exceptions';
// http status codes
import { CREATED_STATUS, OK_STATUS } from 'server/constants/http.status';
// utils
import { generateJWT } from 'server/utils';
// validations
import { validationsOptions } from 'server/validations/validationOptions';
import { loginDto, signinDto } from 'server/validations/auth';

/* GET
–––––––––––––––––––––––––––––––––––––––––––––––––– */
export const checkUser = async (
  req: NextApiRequestExtended,
  res: NextApiResponse
) => {
  delete req.user?.password;
  res.status(OK_STATUS).json({ user: req.user });
};

/* POST
–––––––––––––––––––––––––––––––––––––––––––––––––– */
export const validateSignIn = async (
  req: NextApiRequestExtended,
  res: NextApiResponse,
  next: NextHandler
) => {
  try {
    req.body = await signinDto.validate(req.body, validationsOptions);
  } catch (err: any) {
    throw new BadRequestException('Invalid body.', err.errors);
  }

  await next();
};

export const signIn = async (
  req: NextApiRequestExtended,
  res: NextApiResponse
) => {
  await createUser({ data: req.body });
  res.status(CREATED_STATUS).json({ message: 'User created successfully.' });
};

export const validateLogIn = async (
  req: NextApiRequestExtended,
  res: NextApiResponse,
  next: NextHandler
) => {
  try {
    req.body = await loginDto.validate(req.body, validationsOptions);
  } catch (err: any) {
    throw new BadRequestException('Invalid body.', err.errors);
  }

  await next();
};

export const logIn = async (
  req: NextApiRequestExtended,
  res: NextApiResponse
) => {
  const user = await login({ data: req.body });
  const accessToken = generateJWT({ id: user.id });

  delete user.password;
  res
    .status(OK_STATUS)
    .json({ accessToken, message: 'Log in successfully.', user });
};
