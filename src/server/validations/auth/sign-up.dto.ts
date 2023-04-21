import * as Yup from 'yup';

export const signupDto = Yup.object({
  email: Yup.string().email().required(),
  first_name: Yup.string().trim().required(),
  last_name: Yup.string().trim().required(),
  password: Yup.string().trim().required(),
});

export type SignupDtoType = Yup.TypeOf<typeof signupDto>;
