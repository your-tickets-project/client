// database
import { dbSelect } from 'server/database';
// interfaces
import {
  EventInfoType,
  EventLocationType,
  EventTicketInfoType,
  EventType,
} from 'interfaces';

interface EventRowType {
  event: EventInfoType;
  event_location: EventLocationType;
  event_ticket_info: EventTicketInfoType;
  event_tag: {
    id: number | null;
    event_id: number | null;
    name: string | null;
  };
}

export const findEvents = async (): Promise<EventType[]> => {
  const query = `SELECT * FROM event INNER JOIN event_location ON event.id = event_location.event_id INNER JOIN event_ticket_info ON event.id = event_ticket_info.event_id LEFT JOIN event_tag ON event.id = event_tag.event_id;`;

  const rowData = await dbSelect<EventRowType[]>({ query, nestTables: true });

  const organizedInfo = [];
  const eventIds = new Set();
  const tagIds = new Set();

  for (const data of rowData) {
    if (eventIds.has(data.event.id)) {
      if (!tagIds.has(data.event_tag.id) && data.event_tag.id) {
        for (const e of organizedInfo) {
          if (e.id === data.event.id) {
            e.event_tag.push(data.event_tag);
            tagIds.add(data.event_tag.id);
            break;
          }
        }
      }
    } else {
      const eventData: any = {
        ...data.event,
        event_location: data.event_location,
        event_ticket_info: data.event_ticket_info,
        event_tag: [],
      };

      if (data.event_tag.id) {
        eventData.event_tag.push(data.event_tag);
        tagIds.add(data.event_tag.id);
      }

      eventIds.add(eventData.id);
      organizedInfo.push(eventData);
    }
  }

  return organizedInfo;
};

export const findEvent = async ({
  slug,
}: {
  slug: string;
}): Promise<EventType | null> => {
  const query = `SELECT * FROM event INNER JOIN event_location ON event.id = event_location.event_id INNER JOIN event_ticket_info ON event.id = event_ticket_info.event_id LEFT JOIN event_tag ON event.id = event_tag.event_id WHERE event.slug = ?;`;

  const rowData = await dbSelect<EventRowType[]>({
    query,
    nestTables: true,
    queryValues: [slug],
  });

  let eventData: any = {};
  const tagIds = new Set();

  for (const data of rowData) {
    if (eventData.id) {
      if (!tagIds.has(data.event_tag.id) && data.event_tag.id) {
        eventData.event_tag.push(data.event_tag);
        tagIds.add(data.event_tag.id);
      }
    } else {
      eventData = {
        ...data.event,
        event_location: data.event_location,
        event_ticket_info: data.event_ticket_info,
        event_tag: [],
      };

      if (data.event_tag.id) {
        eventData.event_tag.push(data.event_tag);
        tagIds.add(data.event_tag.id);
      }
    }
  }

  return eventData.id ? eventData : null;
};
