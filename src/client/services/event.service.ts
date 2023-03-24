import { AxiosResponse } from 'axios';
import API from './index';
import {
  EventDetailType,
  EventBasicInfoType,
  EventType,
  NullablePartial,
  EventTagType,
  EventLocationType,
} from 'interfaces';

/* GET
–––––––––––––––––––––––––––––––––––––––––––––––––– */
export const getEvents = async (): Promise<
  AxiosResponse<{ events: EventType[] }>
> => API.get('/event');

export const getEventBySlug = async ({
  slug,
}: {
  slug: string;
}): Promise<AxiosResponse<{ event: EventType }>> => API.get(`/event/${slug}`);

export const getEventBasicInfo = async ({
  eventId,
}: {
  eventId: string | number;
}): Promise<
  AxiosResponse<
    EventBasicInfoType & {
      event_location: EventLocationType;
      event_tag: EventTagType[];
    }
  >
> => API.get(`/event/basic-info/${eventId}`);

export const getEventDetail = async ({
  eventId,
}: {
  eventId: string | number;
}): Promise<
  AxiosResponse<{
    id: number;
    event_detail: NullablePartial<EventDetailType>;
  }>
> => API.get(`/event/details/${eventId}`);

/* POST
–––––––––––––––––––––––––––––––––––––––––––––––––– */
export const postEventBasicInfo = async (
  data: unknown
): Promise<AxiosResponse<{ message: string; insertId: number }>> =>
  API.post(`/event/basic-info`, data);

export const postEventDetail = async ({
  data,
  eventId,
}: {
  data: unknown;
  eventId: string | number;
}): Promise<AxiosResponse<{ message: string; insertId: number }>> =>
  API.post(`/event/details/${eventId}`, data);

/* PUT
–––––––––––––––––––––––––––––––––––––––––––––––––– */
export const putEventBasicInfo = async ({
  data,
  eventId,
}: {
  data: unknown;
  eventId: string | number;
}): Promise<AxiosResponse<{ message: string }>> =>
  API.put(`/event/basic-info/${eventId}`, data);

export const putEventDetail = async ({
  data,
  eventId,
  eventDetailId,
}: {
  data: unknown;
  eventId: string | number;
  eventDetailId: string | number;
}): Promise<AxiosResponse<{ message: string }>> =>
  API.put(`/event/details/${eventId}?event_detail_id=${eventDetailId}`, data);
