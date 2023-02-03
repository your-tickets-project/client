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

export interface EventTicketInfoType {
  id: number;
  event_id: number;
  type: string;
  name: string;
  quantity: number;
  price: number;
  sales_start: Date;
  sales_end: Date;
  time_start: string;
  time_end: string;
  description: null | string;
  minimum_quantity: number;
  maximum_quantity: number;
}

export interface EventInfoType {
  id: number;
  title: string;
  slug: string;
  date_start: Date;
  date_end: Date;
  time_start: string;
  time_end: string;
  cover_image_url: string;
  summary: string;
  description: string | null;
}

export interface EventType extends EventInfoType {
  event_location: EventLocationType;
  event_ticket_info: EventTicketInfoType;
  event_tag: EventTagType[];
}
