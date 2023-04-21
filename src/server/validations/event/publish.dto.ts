import * as Yup from 'yup';

export const PublishDto = Yup.object({
  is_available: Yup.boolean().required(),
});

export type PublishDtoType = Yup.TypeOf<typeof PublishDto>;
