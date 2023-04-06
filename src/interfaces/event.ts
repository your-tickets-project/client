export interface EventLocationType {
  id: number;
  event_id: number;
  venue_name: string;
  address_1: string;
  address_2: string | null;
  city: string;
  state: string | null;
  postal_code: string;
  country: string;
  latitude: string;
  longitude: string;
}

export interface EventTagType {
  id: number;
  event_id: number;
  name: string;
}

export interface ShowEventTicketInfoType {
  id: number;
  name: string;
  price: number;
  quantity: number;
  sales_end: string;
  sales_start: string;
  sold: number;
  time_end: string;
  time_start: string;
  type: string;
  visibility: string;
}

export interface EventTicketInfoType extends ShowEventTicketInfoType {
  event_id: number;
  description: null | string;
  minimum_quantity: number;
  maximum_quantity: number;
}

export interface EventDetailType {
  id: number;
  event_id: number;
  cover_image_url: string;
  summary: string;
  description: string | null;
}

export interface EventBasicInfoType {
  id: number;
  user_id: number;
  title: string;
  slug: string;
  date_start: string;
  date_end: string;
  time_start: string;
  time_end: string;
}

export interface EventType extends EventBasicInfoType {
  event_detail: EventDetailType;
  event_location: EventLocationType;
  event_ticket_info: EventTicketInfoType;
  event_tag: EventTagType[];
}
