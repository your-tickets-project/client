import { AxiosResponse } from 'axios';
import API from './index';

/* GET
–––––––––––––––––––––––––––––––––––––––––––––––––– */
export const getOrders = async ({
  query,
}: {
  query: string;
}): Promise<
  AxiosResponse<
    {
      id: string | number;
      unique_id: string | number;
      event_id: string | number;
      first_name: string;
      last_name: string;
      purchase_date: string;
      purchase_time: string;
      total: string | number;
      title: string;
    }[]
  >
> => {
  let URI = '/orders';
  if (query) URI += `?q=${query}`;
  return API.get(URI);
};

export const getOrder = async ({
  eventId,
  id,
}: {
  eventId: string | number;
  id: string | number;
}): Promise<
  AxiosResponse<{
    id: string | number;
    unique_id: string | number;
    event_id: string | number;
    first_name: string;
    last_name: string;
    total: number;
    purchase_date: string;
    purchase_time: string;
    total_tickets: number;
    ticket_url: string;
    is_available: number;
    title: string;
    date_start: string;
    date_end: string;
    time_start: string;
    time_end: string;
    cover_image_url: string;
    venue_name: string;
  }>
> => API.get(`/orders/${eventId}/${id}`);

export const getDownloadOrderTickets = ({ key }: { key: string }) => {
  return API.get(`/media/${key}`, { responseType: 'blob' });
};

/* POST
–––––––––––––––––––––––––––––––––––––––––––––––––– */
export const postOrder = async ({
  data,
  eventId,
}: {
  data: unknown;
  eventId: string | number;
}): Promise<AxiosResponse<{ message: string; insertId: number }>> =>
  API.post(`/orders/${eventId}`, data);

/* DELETE
–––––––––––––––––––––––––––––––––––––––––––––––––– */
export const deleteOrder = async ({
  eventId,
  id,
}: {
  eventId: string | number;
  id: string | number;
}): Promise<AxiosResponse<{ message: string }>> =>
  API.delete(`/orders/${eventId}/${id}`);
