import * as Yup from 'yup';

export const loginDto = Yup.object({
  email: Yup.string().email().required(),
  password: Yup.string().trim().required(),
});

export type LoginDtoType = Yup.TypeOf<typeof loginDto>;
