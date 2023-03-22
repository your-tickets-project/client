import * as Yup from 'yup';

export const EventDetailDto = Yup.object({
  cover_image_url: Yup.string().optional().nullable(),
  summary: Yup.string().max(140).optional().nullable(),
  description: Yup.string().optional().nullable(),
});

export type EventDetailDtoType = Yup.TypeOf<typeof EventDetailDto>;
