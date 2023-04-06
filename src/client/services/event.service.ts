import { AxiosResponse } from 'axios';
import API from './index';
import {
  EventDetailType,
  EventBasicInfoType,
  EventType,
  NullablePartial,
  EventTagType,
  EventLocationType,
  ShowEventTicketInfoType,
  EventTicketInfoType,
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

export const getCheckSteps = async ({
  eventId,
}: {
  eventId: string | number;
}): Promise<
  AxiosResponse<{
    id: number;
    include_event_detail: boolean;
    include_event_ticket_info: boolean;
  }>
> => API.get(`/event/check-steps/${eventId}`);

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

export const getEventTickets = async ({
  eventId,
}: {
  eventId: string | number;
}): Promise<
  AxiosResponse<{
    id: number;
    event_tickets_info: ShowEventTicketInfoType[];
  }>
> => API.get(`/event/tickets/${eventId}`);

export const getEventTicket = async ({
  eventId,
  ticketId,
}: {
  eventId: string | number;
  ticketId: string | number;
}): Promise<
  AxiosResponse<{
    id: number;
    event_ticket_info: EventTicketInfoType;
  }>
> => API.get(`/event/tickets/${eventId}/${ticketId}`);

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

export const postEventTicket = async ({
  data,
  eventId,
}: {
  data: unknown;
  eventId: string | number;
}): Promise<AxiosResponse<{ message: string }>> =>
  API.post(`/event/tickets/${eventId}`, data);

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
  API.put(`/event/details/${eventId}/${eventDetailId}`, data);

export const putEventTicket = async ({
  data,
  eventId,
  ticketId,
}: {
  data: unknown;
  eventId: string | number;
  ticketId: string | number;
}): Promise<AxiosResponse<{ message: string }>> =>
  API.put(`/event/tickets/${eventId}/${ticketId}`, data);

/* DELETE
–––––––––––––––––––––––––––––––––––––––––––––––––– */
export const deleteEventTicket = async ({
  eventId,
  ticketId,
}: {
  eventId: string | number;
  ticketId: string | number;
}): Promise<AxiosResponse<{ message: string }>> =>
  API.delete(`/event/tickets/${eventId}/${ticketId}`);
