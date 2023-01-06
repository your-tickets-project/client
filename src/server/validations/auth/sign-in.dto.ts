import * as Yup from 'yup';

export const signinDto = Yup.object({
  email: Yup.string().email().required(),
  first_name: Yup.string().trim().required(),
  last_name: Yup.string().trim().required(),
  password: Yup.string().trim().required(),
});

export type SigninDtoType = Yup.TypeOf<typeof signinDto>;
