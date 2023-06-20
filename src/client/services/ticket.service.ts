import { AxiosResponse } from 'axios';
import API from './index';

export const getTickets = async ({
  query,
}: {
  query: string;
}): Promise<
  AxiosResponse<
    {
      id: string | number;
      unique_id: string | number;
      event_id: string | number;
      title: string;
      cover_image_url: string;
      date_start: string;
      time_start: string;
      total: string | number;
      purchase_date: string;
      purchase_time: string;
    }[]
  >
> => {
  let URI = '/ticket';
  if (query) URI += `?q=${query}`;
  return API.get(URI);
};

export const getTicket = async ({
  id,
}: {
  id: string;
}): Promise<
  AxiosResponse<{
    id: string | number;
    unique_id: string | number;
    event_id: string | number;
    purchase_date: string;
    purchase_time: string;
    first_name: string;
    last_name: string;
    email: string;
    title: string;
    date_start: string;
    time_start: string;
    venue_name: string;
    city: string;
    country: string;
    orders_ticket_info: {
      id: number;
      ticket_amount: number;
      total_price: number;
      event_ticket_name: string;
    }[];
  }>
> => API.get(`/ticket/${id}`);
