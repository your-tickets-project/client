/* eslint-disable camelcase */
// database
import { dbDelete, dbInsert, dbSelect, dbUpdate } from 'server/database';
// exceptions
import { NotFoundException } from 'server/exceptions';
// interfaces
import {
  EventDetailType,
  EventBasicInfoType,
  EventLocationType,
  EventTicketInfoType,
  EventType,
  NullablePartial,
  EventTagType,
} from 'interfaces';
// utils
import { slug } from 'server/utils';
// validations
import {
  EventBasicInfoDtoType,
  EventDetailDtoType,
} from 'server/validations/event';

interface EventRowType {
  event: EventBasicInfoType;
  event_detail: EventDetailType;
  event_location: EventLocationType;
  event_ticket_info: EventTicketInfoType;
  event_tag: NullablePartial<EventTagType>;
}

/* GET
–––––––––––––––––––––––––––––––––––––––––––––––––– */
export const findEvents = async (): Promise<EventType[]> => {
  const query = `SELECT * FROM event INNER JOIN event_detail ON event.id = event_detail.event_id INNER JOIN event_location ON event.id = event_location.event_id INNER JOIN event_ticket_info ON event.id = event_ticket_info.event_id LEFT JOIN event_tag ON event.id = event_tag.event_id;`;

  const rowData = await dbSelect<EventRowType[]>({ query, nestTables: true });

  const eventsData = [];
  const eventIds = new Set();
  const tagIds = new Set();

  for (const data of rowData) {
    if (eventIds.has(data.event.id)) {
      if (!tagIds.has(data.event_tag.id) && data.event_tag.id) {
        for (const e of eventsData) {
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
        event_detail: data.event_detail,
        event_location: data.event_location,
        event_ticket_info: data.event_ticket_info,
        event_tag: [],
      };

      if (data.event_tag.id) {
        eventData.event_tag.push(data.event_tag);
        tagIds.add(data.event_tag.id);
      }

      eventIds.add(eventData.id);
      eventsData.push(eventData);
    }
  }

  return eventsData;
};

export const findEventBySlug = async ({
  slug,
}: {
  slug: string;
}): Promise<EventType> => {
  const query = `SELECT * FROM event INNER JOIN event_detail ON event.id = event_detail.event_id INNER JOIN event_location ON event.id = event_location.event_id INNER JOIN event_ticket_info ON event.id = event_ticket_info.event_id LEFT JOIN event_tag ON event.id = event_tag.event_id WHERE event.slug = ?;`;

  const rowData = await dbSelect<EventRowType[]>({
    query,
    nestTables: true,
    queryValues: [slug],
  });

  if (!rowData.length) {
    throw new NotFoundException('Event not found.');
  }

  const eventData: any = {
    ...rowData[0].event,
    event_detail: rowData[0].event_detail,
    event_location: rowData[0].event_location,
    event_ticket_info: rowData[0].event_ticket_info,
    event_tag: [],
  };
  const tagIds = new Set();

  for (const data of rowData) {
    if (data.event_tag.id && !tagIds.has(data.event_tag.id)) {
      eventData.event_tag.push(data.event_tag);
      tagIds.add(data.event_tag.id);
    }
  }

  return eventData;
};

export const findEventBasicInfo = async ({
  eventId,
}: {
  eventId: string;
}): Promise<
  EventBasicInfoType & {
    event_location: EventLocationType;
    event_tag: EventTagType[];
  }
> => {
  const query = `SELECT * FROM event INNER JOIN event_location ON event.id = event_location.event_id LEFT JOIN event_tag ON event.id = event_tag.event_id WHERE event.id = ?;`;

  const rowData = await dbSelect<
    {
      event: EventBasicInfoType;
      event_location: EventLocationType;
      event_tag: NullablePartial<EventTagType>;
    }[]
  >({
    query,
    nestTables: true,
    queryValues: [eventId],
  });

  if (!rowData.length) {
    throw new NotFoundException('Event not found.');
  }

  const eventData: any = {
    ...rowData[0].event,
    event_location: rowData[0].event_location,
    event_tag: [],
  };
  const tagIds = new Set();

  for (const data of rowData) {
    if (data.event_tag.id && !tagIds.has(data.event_tag.id)) {
      eventData.event_tag.push(data.event_tag);
      tagIds.add(data.event_tag.id);
    }
  }

  return eventData;
};

export const findEventDetail = async ({
  eventId,
}: {
  eventId: string;
}): Promise<{
  id: number;
  event_detail: NullablePartial<EventDetailType>;
}> => {
  const query = `SELECT event.id, event_detail.id, event_detail.event_id, event_detail.cover_image_url, event_detail.summary, event_detail.description FROM event LEFT JOIN event_detail ON event.id = event_detail.event_id WHERE event.id = ?;`;

  const rowData = await dbSelect<
    { event: { id: number }; event_detail: NullablePartial<EventDetailType> }[]
  >({
    query,
    nestTables: true,
    queryValues: [eventId],
  });

  if (!rowData.length) {
    throw new NotFoundException('Event not found.');
  }

  return {
    id: rowData[0].event.id,
    event_detail: rowData[0].event_detail,
  };
};

/* POST
–––––––––––––––––––––––––––––––––––––––––––––––––– */
export const createEventBasicInfo = async ({
  data,
}: {
  data: EventBasicInfoDtoType;
}) => {
  const { location, tags, ...restData } = data;
  const slugTitle = slug({ string: restData.title!, options: { lower: true } });

  let query = `INSERT INTO event SET ?;`;
  const res = await dbInsert({ query, data: { ...restData, slug: slugTitle } });

  query = `INSERT INTO event_location SET ?;`;
  await dbInsert({ query, data: { ...location, event_id: res.insertId } });

  if (tags?.length) {
    query = `INSERT INTO event_tag(event_id,name) VALUES`;
    for (const tag of tags) {
      query += ` (${res.insertId}, '${tag}'),`;
    }
    await dbInsert({ query: query.slice(0, -1) });
  }

  return res;
};

export const createEventDetail = async ({
  data,
  eventId,
}: {
  data: EventDetailDtoType;
  eventId: string | number;
}) => {
  let query = `SELECT id FROM event WHERE id = ?;`;
  const rowData = await dbSelect<{ id: number }[]>({
    query,
    queryValues: [eventId],
  });

  if (!rowData.length) {
    throw new NotFoundException('Event not found.');
  }

  query = `INSERT INTO event_detail SET ?;`;
  return dbInsert({ query, data: { ...data, event_id: rowData[0].id } });
};

/* PUT
–––––––––––––––––––––––––––––––––––––––––––––––––– */
export const editEventBasicInfo = async ({
  data,
  eventId,
}: {
  data: EventBasicInfoDtoType;
  eventId: string | number;
}) => {
  const { location, tags, ...restData } = data;
  let query = `UPDATE event INNER JOIN event_location ON event.id = event_location.event_id SET ? WHERE event.id = ?;`;

  const result = await dbUpdate({
    query,
    data: { ...restData, ...location },
    queryValues: [eventId],
  });

  if (!result.affectedRows) {
    throw new NotFoundException('Event not found.');
  }

  if (tags?.length) {
    query = `DELETE from event_tag WHERE event_id = ?;`;
    await dbDelete({ query, queryValues: [eventId] });

    query = `INSERT INTO event_tag(event_id,name) VALUES`;
    for (const tag of tags) {
      query += ` (${eventId}, '${tag}'),`;
    }
    await dbInsert({ query: query.slice(0, -1) });
  }

  return result;
};

export const editEventDetail = async ({
  data,
  eventDetailId,
  eventId,
}: {
  data: EventDetailDtoType;
  eventDetailId: string | number;
  eventId: string | number;
}) => {
  const query = `UPDATE event_detail SET ? WHERE id = ? AND event_id = ?;`;
  const result = await dbUpdate({
    query,
    data,
    queryValues: [eventDetailId, eventId],
  });

  if (!result.affectedRows) {
    throw new NotFoundException('Event not found.');
  }

  return result;
};
