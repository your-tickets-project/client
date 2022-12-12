export interface EventType {
  id: number;
  title: string;
  sub_title?: string;
  information: string;
  sponsor?: string;
  followers?: number;
  fromDate: string;
  toDate: string;
  short_location: string;
  long_location: string;
  price: string;
  src: string;
  announcement?: string;
  slug: string;
  tags: string[];
  ticket_description: string;
  event_ticket_description?: string;
}
