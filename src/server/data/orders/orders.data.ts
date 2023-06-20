// data
import { createMedia } from 'server/data/media/media.data';
// database
import { dbInsert, dbSelect, dbUpdate } from 'server/database';
// exceptions
import { BadRequestException, NotFoundException } from 'server/exceptions';
// utils
import {
  generateBufferTicketPdf,
  generateNumberId,
  mergeBufferPdf,
  sendEmail,
} from 'server/utils';
import { formatTime, getDateData } from 'client/helpers';
// validations
import { CreateOrderDtoType } from 'server/validations/orders/create-order.dto';

const HOST = process.env.NEXT_PUBLIC_HOST;
const PATH = process.env.NEXT_PUBLIC_API_PATH;

export const baseURL = `${HOST}${PATH}`;

const formatDate = ({ date }: { date: string }) => {
  const d = getDateData({
    date,
    monthFormat: 'short',
    weekDayFormat: 'short',
  });
  return `${d.weekDay}, ${d.monthText} ${d.day}, ${d.year}`;
};

/* GET
–––––––––––––––––––––––––––––––––––––––––––––––––– */
export const findOrders = async ({
  q,
  userId,
}: {
  q?: string;
  userId: string | number;
}) => {
  let query =
    'SELECT orders.id, orders.unique_id, orders.event_id, orders.first_name, orders.last_name, orders.purchase_date, orders.purchase_time, orders.total, event.title FROM orders INNER JOIN event ON event.id = orders.event_id WHERE orders.is_available = true AND event.user_id = ?';

  if (q) {
    query += ` AND (CONCAT(orders.id,orders.first_name,orders.last_name,event.title) LIKE "%${q}%")`;
  }

  query += ` ORDER BY orders.id ASC;`;

  return dbSelect<
    {
      id: string | number;
      unique_id: string | number;
      event_id: string | number;
      first_name: string;
      last_name: string;
      purchase_date: string;
      purchase_time: string;
      total: string | number;
      title: string;
    }[]
  >({
    query,
    queryValues: [userId],
  });
};

export const findOrder = async ({
  eventId,
  id,
  userId,
}: {
  eventId: string | number;
  id: string | number;
  userId: string | number;
}) => {
  const query = `SELECT orders.id, orders.unique_id, orders.event_id, orders.first_name, orders.last_name, orders.total, orders.purchase_date, orders.purchase_time, orders.total_tickets, orders.ticket_url, orders.is_available, event.title, event.date_start, event.date_end, event.time_start, event.time_end, event_detail.cover_image_url, event_location.venue_name FROM event INNER JOIN orders ON event.id = orders.event_id INNER JOIN event_location ON event.id = event_location.event_id INNER JOIN event_detail ON event.id = event_detail.event_id WHERE event.id = ? AND orders.unique_id = ? AND event.user_id = ?;`;

  const rowData = await dbSelect<
    {
      id: string | number;
      unique_id: string | number;
      event_id: string | number;
      first_name: string;
      last_name: string;
      total: number;
      purchase_date: string;
      purchase_time: string;
      total_tickets: number;
      ticket_url: string;
      is_available: number;
      title: string;
      date_start: string;
      date_end: string;
      time_start: string;
      time_end: string;
      cover_image_url: string;
      venue_name: string;
    }[]
  >({ query, queryValues: [eventId, id, userId] });

  if (!rowData.length) {
    throw new NotFoundException('Order not found.');
  }

  return rowData[0];
};

/* POST
–––––––––––––––––––––––––––––––––––––––––––––––––– */
export const createOrder = async ({
  data,
  eventId,
  userId,
}: {
  data: CreateOrderDtoType;
  eventId: string | number;
  userId: string | number;
}) => {
  const { tickets, ...rest } = data;
  const inClause = tickets!.map((ticket) => `'${ticket.id}'`).join();
  const query = `SELECT event.title, event.date_start, event.time_start, event.date_end, event.time_end, event_location.venue_name, event_location.address_1, event_location.city, event_location.postal_code, event_location.country, event_detail.cover_image_url, event_ticket_info.id, event_ticket_info.name, (event_ticket_info.quantity - event_ticket_info.sold) AS remaining FROM event INNER JOIN event_location ON event.id = event_location.event_id INNER JOIN event_detail ON event.id = event_detail.event_id INNER JOIN event_ticket_info ON event.id = event_ticket_info.event_id WHERE event.id = ? AND event_ticket_info.id IN (${inClause})`;

  const rowData = await dbSelect<
    {
      event: {
        title: string;
        date_start: string;
        time_start: string;
        date_end: string;
        time_end: string;
      };
      event_location: {
        venue_name: string;
        address_1: string;
        city: string;
        postal_code: string;
        country: string;
      };
      event_detail: { cover_image_url: string };
      event_ticket_info: { id: string | number; name: string };
      ['']: { remaining: number };
    }[]
  >({
    query,
    nestTables: true,
    queryValues: [eventId],
  });

  const info: {
    title: string;
    date_start: string;
    time_start: string;
    date_end: string;
    time_end: string;
    venue_name: string;
    address_1: string;
    city: string;
    postal_code: string;
    country: string;
    cover_image_url: string;
    eventTicketsInfo: {
      id: string | number;
      name: string;
      remaining: number;
    }[];
  } = {
    ...rowData[0].event,
    ...rowData[0].event_location,
    ...rowData[0].event_detail,
    eventTicketsInfo: [],
  };

  const eventTicketInfoIds = new Set();
  for (const data of rowData) {
    if (
      data.event_ticket_info.id &&
      !eventTicketInfoIds.has(data.event_ticket_info.id)
    ) {
      info.eventTicketsInfo.push({
        ...data.event_ticket_info,
        remaining: data[''].remaining,
      });
      eventTicketInfoIds.add(data.event_ticket_info.id);
    }
  }

  for await (const ticket of tickets!) {
    const ticketInfo = info.eventTicketsInfo.find(
      (data) => data.id === ticket.id
    )!;
    if (ticketInfo.remaining - ticket.amount! < 0) {
      let message = `Only ${ticketInfo.remaining} ${ticketInfo.name} ticket${
        ticketInfo.remaining > 1 ? 's' : ''
      } left.`;
      if (ticketInfo.remaining === 0) {
        message = `All ${ticketInfo.name} tickets sold.`;
      }
      throw new BadRequestException(message);
    }

    const result = await dbUpdate({
      query:
        'UPDATE event_ticket_info SET sold = sold + ? WHERE id = ? AND event_id = ?;',
      queryValues: [ticket.amount!, ticket.id!, eventId],
    });

    if (!result.affectedRows) {
      throw new BadRequestException(`Ticket #${ticket.id!} not found.`);
    }
  }

  const orderUniqueId = generateNumberId({ size: 9 });
  let total = 0;
  let totalTicketAmount = 0;
  const bufferFiles: Buffer[] = [];
  for await (const ticket of tickets!) {
    total += ticket.price!;
    totalTicketAmount += ticket.amount!;

    for (let i = 1; i <= ticket.amount!; i++) {
      const eventTicketInfoName = info.eventTicketsInfo.find(
        (t) => t.id === ticket.id
      )!.name;

      const bufferTicket = await generateBufferTicketPdf({
        id: orderUniqueId,
        eventTicketInfoName,
        eventTitle: info.title,
        venueName: info.venue_name,
        address: info.address_1,
        city: info.city,
        postalCode: info.postal_code,
        country: info.country,
        eventStart: `${formatDate({
          date: info.date_start,
        })} at ${formatTime({ time: info.time_start, timeFormat: 'short' })}`,
        eventEnd: `${formatDate({
          date: info.date_end,
        })} at ${formatTime({
          time: info.time_end,
          timeFormat: 'short',
        })}`,
        orderName: `${rest.first_name} ${rest.last_name}`,
        orderDate: `${formatDate({
          date: `${rest.purchase_date!}T00:00:00`,
        })} at ${formatTime({
          time: rest.purchase_time!,
          timeFormat: 'short',
        })}`,
        imageUrl: `${baseURL}/media/${info.cover_image_url}`,
      });
      bufferFiles.push(bufferTicket);
    }
  }

  const mergePdfName = `order-${orderUniqueId}`;
  const pdfBuffer = await mergeBufferPdf({
    bufferFiles,
  });

  await sendEmail({
    attachments: [
      {
        content: pdfBuffer,
        disposition: 'attachment',
        filename: `${mergePdfName}.pdf`,
        type: 'application/pdf',
      },
    ],
    subject: `Order notification for ${info.title}`,
    text: `${rest.first_name}, you've got tickets!`,
    to: rest.email!,
  });

  const filesData = await createMedia({
    files: [
      {
        buffer: pdfBuffer,
        encoding: 'utf8',
        fieldname: '',
        mimetype: 'application/pdf',
        originalname: mergePdfName,
        size: 0,
      },
    ],
    addOriginalName: true,
  });

  const result = await dbInsert({
    query: `INSERT INTO orders SET ?;`,
    data: {
      ...rest,
      unique_id: orderUniqueId,
      event_id: eventId,
      user_id: userId,
      is_available: true,
      ticket_url: filesData[0].Key,
      total,
      total_tickets: totalTicketAmount,
    },
  });

  for await (const ticket of tickets!) {
    dbInsert({
      query: 'INSERT INTO orders_ticket_info SET ?;',
      data: {
        orders_id: result.insertId,
        event_ticket_info_id: ticket.id!,
        ticket_amount: ticket.amount!,
        total_price: ticket.price!,
      },
    });
  }

  return { insertId: orderUniqueId };
};

/* DELETE
–––––––––––––––––––––––––––––––––––––––––––––––––– */
export const removeOrder = async ({
  eventId,
  id,
  userId,
}: {
  eventId: string | number;
  id: string | number;
  userId: string | number;
}) => {
  const query = `UPDATE orders INNER JOIN event ON event.id = orders.event_id SET orders.is_available = false WHERE orders.unique_id = ? AND event.id = ? AND event.user_id = ?;`;

  const result = await dbUpdate({
    query,
    queryValues: [id, eventId, userId],
  });

  if (!result.affectedRows) {
    throw new NotFoundException('Order not found.');
  }

  return result;
};
