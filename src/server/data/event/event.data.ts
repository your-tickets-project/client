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
  EventPreviewPublishType,
} from 'interfaces';
// utils
import { generateId, slug } from 'server/utils';
// validations
import {
  EventBasicInfoDtoType,
  EventDetailDtoType,
  EventTicketDtoType,
} from 'server/validations/event';
import { PublishDtoType } from 'server/validations/event/publish.dto';

interface EventRowType {
  event: EventBasicInfoType;
  event_location: EventLocationType;
  event_detail: EventDetailType;
  event_ticket_info: EventTicketInfoType;
  event_tag: NullablePartial<EventTagType>;
}

/* GET
–––––––––––––––––––––––––––––––––––––––––––––––––– */
export const findEvents = async (): Promise<EventType[]> => {
  const query = `SELECT * FROM event INNER JOIN event_detail ON event.id = event_detail.event_id INNER JOIN event_location ON event.id = event_location.event_id INNER JOIN event_ticket_info ON event.id = event_ticket_info.event_id LEFT JOIN event_tag ON event.id = event_tag.event_id WHERE event.is_available = true;`;

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
  const query = `SELECT * FROM event INNER JOIN event_location ON event.id = event_location.event_id INNER JOIN event_detail ON event.id = event_detail.event_id INNER JOIN event_ticket_info ON event.id = event_ticket_info.event_id LEFT JOIN event_tag ON event.id = event_tag.event_id WHERE event.slug = ? AND event.is_available = true;`;

  const rowData = await dbSelect<EventRowType[]>({
    query,
    nestTables: true,
    queryValues: [slug],
  });

  if (!rowData.length) {
    throw new NotFoundException('Event not found.');
  }

  delete rowData[0].event.user_id;
  const eventData: any = {
    ...rowData[0].event,
    event_location: rowData[0].event_location,
    event_detail: rowData[0].event_detail,
    event_ticket_info: [],
    event_tag: [],
  };
  const tagIds = new Set();
  const ticketIds = new Set();

  for (const data of rowData) {
    if (data.event_tag.id && !tagIds.has(data.event_tag.id)) {
      eventData.event_tag.push(data.event_tag);
      tagIds.add(data.event_tag.id);
    }
    if (
      data.event_ticket_info.id &&
      !ticketIds.has(data.event_ticket_info.id)
    ) {
      eventData.event_ticket_info.push(data.event_ticket_info);
      ticketIds.add(data.event_ticket_info.id);
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
  const query = `SELECT event.id, event.is_available, COUNT(event_detail.id) AS event_detail_amount, COUNT(event_ticket_info.id) AS event_ticket_info_amount FROM event LEFT JOIN event_detail ON event.id = event_detail.event_id LEFT JOIN event_ticket_info ON event.id = event_ticket_info.event_id WHERE event.id = ? AND event.user_id = ?;`;

  const rowData = await dbSelect<
    {
      id: number;
      is_available: number;
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
    is_available: rowData[0].is_available,
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

export const findEventPreviewPublish = async ({
  eventId,
  userId,
}: {
  eventId: string | number;
  userId: string | number;
}): Promise<EventPreviewPublishType> => {
  const query = `SELECT event.id, event.title, event.date_start, event.time_start, event.is_available, event_location.address_1, event_location.city, event_location.state, event_location.country, event_location.postal_code, event_detail.cover_image_url, event_detail.summary, MIN(event_ticket_info.price) as ticket_smallest_price, MAX(event_ticket_info.price) as ticket_largest_price, SUM(event_ticket_info.quantity) as total_quantity FROM event INNER JOIN event_location ON event.id = event_location.event_id LEFT JOIN event_detail ON event.id = event_detail.event_id LEFT JOIN event_ticket_info ON event.id = event_ticket_info.event_id WHERE event.id = ? AND event.user_id = ?;`;

  const rowData = await dbSelect<
    {
      id: number;
      title: string;
      date_start: string;
      time_start: string;
      is_available: number;
      address_1: string;
      city: string;
      state: string | null;
      country: string;
      postal_code: string;
      cover_image_url: string | null;
      summary: string | null;
      ticket_smallest_price: number | null;
      ticket_largest_price: number | null;
      total_quantity: number | null;
    }[]
  >({
    query,
    queryValues: [eventId, userId],
  });

  if (!rowData.length || !rowData[0] || rowData[0].id === null) {
    throw new NotFoundException('Event not found.');
  }

  const data = rowData[0];

  return {
    id: data.id,
    title: data.title,
    date_start: data.date_start,
    time_start: data.time_start,
    is_available: data.is_available,
    ticket_largest_price: data.ticket_largest_price,
    ticket_smallest_price: data.ticket_smallest_price,
    total_quantity: data.total_quantity,
    event_location: {
      address_1: data.address_1,
      city: data.city,
      state: data.state,
      country: data.country,
      postal_code: data.postal_code,
    },
    event_detail: {
      cover_image_url: data.cover_image_url,
      summary: data.summary,
    },
  };
};

export const findEventPreview = async ({
  eventId,
  userId,
}: {
  eventId: string | number;
  userId: string | number;
}): Promise<
  EventBasicInfoType & {
    event_location: EventLocationType;
    event_detail: NullablePartial<EventDetailType>;
    event_ticket_info: EventTicketInfoType[];
    event_tag: EventTagType[];
  }
> => {
  const query = `SELECT * FROM event INNER JOIN event_location ON event.id = event_location.event_id LEFT JOIN event_detail ON event.id = event_detail.event_id LEFT JOIN event_ticket_info ON event.id = event_ticket_info.event_id LEFT JOIN event_tag ON event.id = event_tag.event_id WHERE event.id = ? AND event.user_id = ?;`;

  const rowData = await dbSelect<
    {
      event: EventBasicInfoType;
      event_location: EventLocationType;
      event_detail: NullablePartial<EventDetailType>;
      event_ticket_info: NullablePartial<EventTicketInfoType>;
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

  delete rowData[0].event.user_id;
  const eventData: any = {
    ...rowData[0].event,
    event_location: rowData[0].event_location,
    event_detail: rowData[0].event_detail,
    event_ticket_info: [],
    event_tag: [],
  };
  const tagIds = new Set();
  const ticketIds = new Set();

  for (const data of rowData) {
    if (data.event_tag.id && !tagIds.has(data.event_tag.id)) {
      eventData.event_tag.push(data.event_tag);
      tagIds.add(data.event_tag.id);
    }
    if (
      data.event_ticket_info.id &&
      !ticketIds.has(data.event_ticket_info.id)
    ) {
      eventData.event_ticket_info.push(data.event_ticket_info);
      ticketIds.add(data.event_ticket_info.id);
    }
  }

  return eventData;
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
  const slugTitle = slug({
    string: `${restData.title!}-${generateId()}`,
    options: { lower: true },
  });

  let query = `INSERT INTO event SET ?;`;
  const res = await dbInsert({
    query,
    data: {
      ...restData,
      slug: slugTitle,
      is_available: 0,
      user_id: userId,
    },
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

export const editPublishEvent = async ({
  data,
  eventId,
  userId,
}: {
  data: PublishDtoType;
  eventId: string | number;
  userId: string | number;
}) => {
  const query = `UPDATE event SET is_available = ? WHERE event.id = ? AND event.user_id = ?;`;

  const result = await dbUpdate({
    query,
    queryValues: [+data.is_available!, eventId, userId],
  });

  if (!result.affectedRows) {
    throw new NotFoundException('Event not found.');
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
