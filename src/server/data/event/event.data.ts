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
  ShowEventTicketInfoType,
} from 'interfaces';
// utils
import { slug } from 'server/utils';
// validations
import {
  EventBasicInfoDtoType,
  EventDetailDtoType,
  EventTicketDtoType,
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

export const findCheckSteps = async ({
  eventId,
  userId,
}: {
  eventId: string | number;
  userId: string | number;
}) => {
  const query = `SELECT event.id, COUNT(event_detail.id) AS event_detail_amount, COUNT(event_ticket_info.id) AS event_ticket_info_amount FROM event LEFT JOIN event_detail ON event.id = event_detail.event_id LEFT JOIN event_ticket_info ON event.id = event_ticket_info.event_id WHERE event.id = ? AND event.user_id = ?;`;

  const rowData = await dbSelect<
    {
      id: number;
      event_detail_amount: number;
      event_ticket_info_amount: number;
    }[]
  >({
    query,
    queryValues: [eventId, userId],
  });

  if (!rowData.length || !rowData[0] || rowData[0].id === null) {
    throw new NotFoundException('Event not found.');
  }

  return {
    id: rowData[0].id,
    include_event_detail: !!rowData[0].event_detail_amount,
    include_event_ticket_info: !!rowData[0].event_ticket_info_amount,
  };
};

export const findEventBasicInfo = async ({
  eventId,
  userId,
}: {
  eventId: string | number;
  userId: string | number;
}): Promise<
  EventBasicInfoType & {
    event_location: EventLocationType;
    event_tag: EventTagType[];
  }
> => {
  const query = `SELECT * FROM event INNER JOIN event_location ON event.id = event_location.event_id LEFT JOIN event_tag ON event.id = event_tag.event_id WHERE event.id = ? AND event.user_id = ?;`;

  const rowData = await dbSelect<
    {
      event: EventBasicInfoType;
      event_location: EventLocationType;
      event_tag: NullablePartial<EventTagType>;
    }[]
  >({
    query,
    nestTables: true,
    queryValues: [eventId, userId],
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
  userId,
}: {
  eventId: string | number;
  userId: string | number;
}): Promise<{
  id: number;
  event_detail: NullablePartial<EventDetailType>;
}> => {
  const query = `SELECT event.id, event_detail.id, event_detail.event_id, event_detail.cover_image_url, event_detail.summary, event_detail.description FROM event LEFT JOIN event_detail ON event.id = event_detail.event_id WHERE event.id = ? AND event.user_id = ?;`;

  const rowData = await dbSelect<
    { event: { id: number }; event_detail: NullablePartial<EventDetailType> }[]
  >({
    query,
    nestTables: true,
    queryValues: [eventId, userId],
  });

  if (!rowData.length) {
    throw new NotFoundException('Event not found.');
  }

  return {
    id: rowData[0].event.id,
    event_detail: rowData[0].event_detail,
  };
};

export const findEventTickets = async ({
  eventId,
  userId,
}: {
  eventId: string | number;
  userId: string | number;
}): Promise<{
  id: number;
  event_tickets_info: ShowEventTicketInfoType[];
}> => {
  const query = `SELECT event.id, event_ticket_info.id, event_ticket_info.type, event_ticket_info.name, event_ticket_info.quantity, event_ticket_info.sold, event_ticket_info.price, event_ticket_info.sales_start, event_ticket_info.sales_end, event_ticket_info.time_start, event_ticket_info.time_end, event_ticket_info.visibility FROM event LEFT JOIN event_ticket_info ON event.id = event_ticket_info.event_id WHERE event.id = ? AND event.user_id = ?;`;

  const rowData = await dbSelect<
    {
      event: { id: number };
      event_ticket_info: NullablePartial<ShowEventTicketInfoType>;
    }[]
  >({
    query,
    nestTables: true,
    queryValues: [eventId, userId],
  });

  if (!rowData.length) {
    throw new NotFoundException('Event not found.');
  }

  const eventData: any = {
    id: rowData[0].event.id,
    event_tickets_info: [],
  };
  const ticketIds = new Set();

  for (const data of rowData) {
    if (
      data.event_ticket_info.id &&
      !ticketIds.has(data.event_ticket_info.id)
    ) {
      eventData.event_tickets_info.push(data.event_ticket_info);
      ticketIds.add(data.event_ticket_info.id);
    }
  }

  return eventData;
};

export const findEventTicket = async ({
  eventId,
  ticketId,
  userId,
}: {
  eventId: string | number;
  ticketId: string | number;
  userId: string | number;
}): Promise<{
  id: number;
  event_ticket_info: EventTicketInfoType;
}> => {
  const query = `SELECT event.id, event_ticket_info.id, event_ticket_info.event_id, event_ticket_info.type, event_ticket_info.name, event_ticket_info.quantity, event_ticket_info.sold, event_ticket_info.price, event_ticket_info.sales_start, event_ticket_info.sales_end, event_ticket_info.time_start, event_ticket_info.time_end, event_ticket_info.description, event_ticket_info.maximum_quantity, event_ticket_info.minimum_quantity, event_ticket_info.visibility FROM event INNER JOIN event_ticket_info ON event.id = event_ticket_info.event_id WHERE event_ticket_info.id = ? AND event.id = ? AND event.user_id = ?;`;

  const rowData = await dbSelect<
    {
      event: { id: number };
      event_ticket_info: EventTicketInfoType;
    }[]
  >({
    query,
    nestTables: true,
    queryValues: [ticketId, eventId, userId],
  });

  if (!rowData.length) {
    throw new NotFoundException('Ticket not found.');
  }

  return {
    id: rowData[0].event.id,
    event_ticket_info: rowData[0].event_ticket_info,
  };
};

/* POST
–––––––––––––––––––––––––––––––––––––––––––––––––– */
export const createEventBasicInfo = async ({
  data,
  userId,
}: {
  data: EventBasicInfoDtoType;
  userId: string | number;
}) => {
  const { location, tags, ...restData } = data;
  const slugTitle = slug({ string: restData.title!, options: { lower: true } });

  let query = `INSERT INTO event SET ?;`;
  const res = await dbInsert({
    query,
    data: { ...restData, slug: slugTitle, user_id: userId },
  });

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
  userId,
}: {
  data: EventDetailDtoType;
  eventId: string | number;
  userId: string | number;
}) => {
  let query = `SELECT id FROM event WHERE id = ? AND user_id = ?;`;
  const rowData = await dbSelect<{ id: number }[]>({
    query,
    queryValues: [eventId, userId],
  });

  if (!rowData.length) {
    throw new NotFoundException('Event not found.');
  }

  query = `INSERT INTO event_detail SET ?;`;
  return dbInsert({ query, data: { ...data, event_id: rowData[0].id } });
};

export const createEventTicket = async ({
  data,
  eventId,
  userId,
}: {
  data: EventTicketDtoType;
  eventId: string | number;
  userId: string | number;
}) => {
  let query = `SELECT id FROM event WHERE id = ? AND user_id = ?;`;
  const rowData = await dbSelect<{ id: number }[]>({
    query,
    queryValues: [eventId, userId],
  });

  if (!rowData.length) {
    throw new NotFoundException('Event not found.');
  }

  query = `INSERT INTO event_ticket_info SET ?;`;
  return dbInsert({
    query,
    data: { ...data, sold: 0, event_id: rowData[0].id },
  });
};

/* PUT
–––––––––––––––––––––––––––––––––––––––––––––––––– */
export const editEventBasicInfo = async ({
  data,
  eventId,
  userId,
}: {
  data: EventBasicInfoDtoType;
  eventId: string | number;
  userId: string | number;
}) => {
  const { location, tags, ...restData } = data;
  let query = `UPDATE event INNER JOIN event_location ON event.id = event_location.event_id SET ? WHERE event.id = ? AND event.user_id = ?;`;

  const result = await dbUpdate({
    query,
    data: { ...restData, ...location },
    queryValues: [eventId, userId],
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
  userId,
}: {
  data: EventDetailDtoType;
  eventDetailId: string | number;
  eventId: string | number;
  userId: string | number;
}) => {
  let query = `UPDATE event_detail INNER JOIN event ON event.id = event_detail.event_id SET`;
  const queryValues = [];

  if (data.cover_image_url !== undefined) {
    query += ` event_detail.cover_image_url = ?`;
    queryValues.push(data.cover_image_url);
  }
  if (data.description !== undefined) {
    query += data.cover_image_url ? ',' : '';
    query += ` event_detail.description = ?`;
    queryValues.push(data.description);
  }
  if (data.summary !== undefined) {
    query += data.cover_image_url || data.description ? ',' : '';
    query += ` event_detail.summary = ?`;
    queryValues.push(data.summary);
  }

  query += ` WHERE event_detail.id = ? AND event.id = ? AND event.user_id = ?;`;
  queryValues.push(eventDetailId, eventId, userId);

  const result = await dbUpdate({
    query,
    queryValues,
  });

  if (!result.affectedRows) {
    throw new NotFoundException('Event not found.');
  }

  return result;
};

export const editEventTicket = async ({
  data,
  eventId,
  ticketId,
  userId,
}: {
  data: EventTicketDtoType;
  eventId: string | number;
  ticketId: string | number;
  userId: string | number;
}) => {
  const query = `UPDATE event_ticket_info INNER JOIN event ON event.id = event_ticket_info.event_id SET event_ticket_info.type = ?, event_ticket_info.name = ?, event_ticket_info.quantity = ?, event_ticket_info.price = ?, event_ticket_info.sales_start = ?, event_ticket_info.sales_end = ?, event_ticket_info.time_start = ?, event_ticket_info.time_end = ?, event_ticket_info.description = ?, event_ticket_info.maximum_quantity = ?, event_ticket_info.minimum_quantity = ?, event_ticket_info.visibility = ? WHERE event_ticket_info.id = ? AND event.id = ? AND event.user_id = ?;`;

  const result = await dbUpdate({
    query,
    queryValues: [
      data.type!,
      data.name!,
      data.quantity!,
      data.price!,
      data.sales_start!,
      data.sales_end!,
      data.time_start!,
      data.time_end!,
      data.description || null,
      data.maximum_quantity!,
      data.minimum_quantity!,
      data.visibility!,
      ticketId,
      eventId,
      userId,
    ],
  });

  if (!result.affectedRows) {
    throw new NotFoundException('Ticket not found.');
  }

  return result;
};

/* DELETE
–––––––––––––––––––––––––––––––––––––––––––––––––– */
export const removeEventTicket = async ({
  eventId,
  ticketId,
  userId,
}: {
  eventId: string | number;
  ticketId: string | number;
  userId: string | number;
}) => {
  const query = `DELETE event_ticket_info FROM event_ticket_info INNER JOIN event ON event.id = event_ticket_info.event_id WHERE event_ticket_info.id = ? AND event.id = ? AND event.user_id = ?;`;

  const result = await dbDelete({
    query,
    queryValues: [ticketId, eventId, userId],
  });

  if (!result.affectedRows) {
    throw new NotFoundException('Ticket not found.');
  }

  return result;
};
