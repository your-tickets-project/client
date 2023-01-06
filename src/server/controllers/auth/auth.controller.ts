import { NextApiResponse } from 'next';
import { NextHandler } from 'next-connect';
import { NextApiRequestExtended } from 'server/router';
// data
import { create, login } from 'server/data';
// utils
import { generateJWT } from 'server/utils';
// validations
import { loginDto, signinDto } from 'server/validations/auth';

export const validateSignIn = async (
  req: NextApiRequestExtended,
  res: NextApiResponse,
  next: NextHandler
) => {
  try {
    req.body = await signinDto.validate(req.body, {
      stripUnknown: true,
      strict: true,
      abortEarly: false,
    });
    next();
  } catch (error) {
    return res.status(400).json({ error, message: 'Invalid body' });
  }
};

export const signIn = async (
  req: NextApiRequestExtended,
  res: NextApiResponse
) => {
  try {
    await create({ data: req.body });
    res.status(201).json({ message: 'User created successfully' });
  } catch (error: any) {
    if (error.message === 'This email is already being used') {
      res.status(400).json({ message: error.message });
      return;
    }

    res.status(500).json({ message: 'Internal server error' });
  }
};

export const validateLogIn = async (
  req: NextApiRequestExtended,
  res: NextApiResponse,
  next: NextHandler
) => {
  try {
    req.body = await loginDto.validate(req.body, {
      stripUnknown: true,
      strict: true,
      abortEarly: false,
    });
    next();
  } catch (error) {
    return res.status(400).json({ error, message: 'Invalid body' });
  }
};

export const logIn = async (
  req: NextApiRequestExtended,
  res: NextApiResponse
) => {
  try {
    const user = await login({ data: req.body });
    const accessToken = generateJWT({ id: user.id });
    res.status(200).json({ accessToken, message: 'Log in successfully', user });
  } catch (error: any) {
    if (error.message === 'Invalid email or password') {
      res.status(400).json({ message: error.message });
      return;
    }

    res.status(500).json({ message: 'Internal server error' });
  }
};

export const checkUser = async (
  req: NextApiRequestExtended,
  res: NextApiResponse
) => {
  delete req.user?.password;
  res.status(200).json({ user: req.user });
};
