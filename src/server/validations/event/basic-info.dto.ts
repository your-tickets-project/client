import * as Yup from 'yup';

export const EventBasicInfoDto = Yup.object({
  title: Yup.string().max(75).required(),
  tags: Yup.array().of(Yup.string()).max(5),
  location: Yup.object({
    venue_name: Yup.string().max(500).required(),
    address_1: Yup.string().max(100).required(),
    address_2: Yup.string().max(120).nullable(),
    city: Yup.string().max(50).required(),
    state: Yup.string().max(30),
    postal_code: Yup.string().max(30).required(),
    country: Yup.string().max(30).required(),
    latitude: Yup.number().required(),
    longitude: Yup.number().required(),
  }).required(),
  date_start: Yup.string().required(),
  date_end: Yup.string().required(),
  time_start: Yup.string().max(20).required(),
  time_end: Yup.string().max(20).required(),
});

export type EventBasicInfoDtoType = Yup.TypeOf<typeof EventBasicInfoDto>;
