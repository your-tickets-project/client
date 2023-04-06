import * as Yup from 'yup';

export const EventTicketDto = Yup.object({
  description: Yup.string().max(2_500).nullable(),
  maximum_quantity: Yup.number().required().max(100).min(1),
  minimum_quantity: Yup.number().required().max(100).min(1),
  name: Yup.string().required().max(50),
  price: Yup.number().required().max(1_000_000).min(0),
  quantity: Yup.number().required().max(500_000).min(1),
  sales_end: Yup.string().required(),
  sales_start: Yup.string().required(),
  time_end: Yup.string().required(),
  time_start: Yup.string().required(),
  type: Yup.string()
    .required()
    .test({
      message: 'type value must be "free" or "paid"',
      test: (value) => value === 'free' || value === 'paid',
    }),
  visibility: Yup.string()
    .required()
    .test({
      message: 'visibility value must be "visible" or "hidden"',
      test: (value) => value === 'visible' || value === 'hidden',
    }),
});

export type EventTicketDtoType = Yup.TypeOf<typeof EventTicketDto>;
