import { AxiosResponse } from 'axios';
import { EventType } from 'interfaces';
import API from './index';

export const getEvents = async (): Promise<
  AxiosResponse<{ events: EventType[] }>
> => API.get('/event');

export const getEvent = async ({
  slug,
}: {
  slug: string;
}): Promise<AxiosResponse<{ event: EventType | null }>> =>
  API.get(`/event/${slug}`);
