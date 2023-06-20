import * as Yup from 'yup';

export const CreateOrderDto = Yup.object({
  first_name: Yup.string().max(100).required(),
  last_name: Yup.string().max(100).required(),
  email: Yup.string().email().required(),
  purchase_date: Yup.string().required(),
  purchase_time: Yup.string().required(),
  tickets: Yup.array()
    .of(
      Yup.object({
        id: Yup.number().required(),
        amount: Yup.number().required(),
        price: Yup.number().required(),
      })
    )
    .min(1)
    .required(),
});

export type CreateOrderDtoType = Yup.TypeOf<typeof CreateOrderDto>;
