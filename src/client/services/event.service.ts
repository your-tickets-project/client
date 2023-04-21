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
  EventPreviewPublishType,
} from 'interfaces';

/* GET
–––––––––––––––––––––––––––––––––––––––––––––––––– */
export const getEvents = async (): Promise<
  AxiosResponse<{
    events: {
      id: number | string;
      slug: string;
      title: string;
      date_start: string;
      time_start: string;
      venue_name: string;
      city: string;
      state: string | null;
      cover_image_url: string;
      ticket_smallest_price: number;
    }[];
  }>
> => API.get('/event');

export const getEventBySlug = async ({
  slug,
}: {
  slug: string;
}): Promise<AxiosResponse<EventType>> => API.get(`/event/${slug}`);

export const getCheckSteps = async ({
  eventId,
}: {
  eventId: string | number;
}): Promise<
  AxiosResponse<{
    id: number;
    is_available: number;
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
    is_available: number;
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

export const getEventPreviewPublish = async ({
  eventId,
}: {
  eventId: string | number;
}): Promise<AxiosResponse<EventPreviewPublishType>> =>
  API.get(`/event/preview-publish/${eventId}`);

export const getEventPreview = async ({
  eventId,
}: {
  eventId: string | number;
}): Promise<
  AxiosResponse<
    EventBasicInfoType & {
      event_location: EventLocationType;
      event_detail: NullablePartial<EventDetailType>;
      event_ticket_info: EventTicketInfoType[];
      event_tag: EventTagType[];
    }
  >
> => API.get(`/event/preview/${eventId}`);

export const getEventsDashboard = async (): Promise<
  AxiosResponse<
    {
      id: number;
      date_start: string;
      time_start: string;
      title: string;
      is_available: number;
      venue_name: string;
      include_event_detail: number;
      cover_image_url: string | null;
      include_event_ticket_info: number;
      total_sold: number | null;
      total_quantity: number | null;
    }[]
  >
> => API.get(`/event/dashboard`);

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

export const putPublishEvent = async ({
  data,
  eventId,
}: {
  data: unknown;
  eventId: string | number;
}): Promise<AxiosResponse<{ message: string }>> =>
  API.put(`/event/publish/${eventId}`, data);

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

export const deleteEventDashboard = async ({
  eventId,
}: {
  eventId: string | number;
}): Promise<AxiosResponse<{ message: string }>> =>
  API.delete(`/event/dashboard/${eventId}`);
