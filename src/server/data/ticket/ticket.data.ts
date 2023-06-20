// database
import { dbSelect } from 'server/database';
// exceptions
import { NotFoundException } from 'server/exceptions';

export const findTickets = async ({
  q,
  userId,
}: {
  q?: string;
  userId: string | number;
}) => {
  let query = `SELECT orders.id, orders.unique_id, orders.event_id, orders.total, orders.purchase_date, orders.purchase_time, event.title, event.date_start, event.time_start, event_detail.cover_image_url FROM event INNER JOIN orders ON event.id = orders.event_id INNER JOIN event_detail ON event.id = event_detail.event_id WHERE orders.user_id = ?`;

  if (q) {
    query += ` AND (CONCAT(event.title,orders.id) LIKE "%${q}%");`;
  }

  return dbSelect<
    {
      id: string | number;
      unique_id: string | number;
      event_id: string | number;
      title: string;
      cover_image_url: string;
      date_start: string;
      time_start: string;
      total: string | number;
      purchase_date: string;
      purchase_time: string;
    }[]
  >({ query, queryValues: [userId] });
};

export const findTicket = async ({
  ticketId,
  userId,
}: {
  ticketId: string;
  userId: string | number;
}): Promise<{
  id: string | number;
  event_id: string | number;
  purchase_date: string;
  purchase_time: string;
  first_name: string;
  last_name: string;
  email: string;
  title: string;
  date_start: string;
  time_start: string;
  venue_name: string;
  city: string;
  country: string;
  orders_ticket_info: {
    id: number;
    ticket_amount: number;
    total_price: number;
    event_ticket_name: string;
  }[];
}> => {
  const query = `SELECT orders.id, orders.unique_id, orders.event_id, orders.purchase_date, orders.purchase_time, orders.first_name, orders.last_name, orders.email, orders_ticket_info.id, orders_ticket_info.ticket_amount, orders_ticket_info.total_price, event_ticket_info.name, event.title, event.date_start, event.time_start, event_location.venue_name, event_location.city, event_location.country FROM event INNER JOIN orders ON event.id = orders.event_id INNER JOIN event_location ON event.id = event_location.event_id INNER JOIN orders_ticket_info ON orders.id = orders_ticket_info.orders_id INNER JOIN event_ticket_info ON event_ticket_info.id = orders_ticket_info.event_ticket_info_id WHERE orders.unique_id = ? AND orders.user_id = ?;`;

  const rowData = await dbSelect<
    {
      orders: {
        id: string | number;
        unique_id: string | number;
        event_id: string | number;
        purchase_date: string;
        purchase_time: string;
        first_name: string;
        last_name: string;
        email: string;
      };
      orders_ticket_info: {
        id: number;
        ticket_amount: number;
        total_price: number;
      };
      event_ticket_info: { name: string };
      event: {
        title: string;
        date_start: string;
        time_start: string;
      };
      event_location: {
        venue_name: string;
        city: string;
        country: string;
      };
    }[]
  >({ query, queryValues: [ticketId, userId], nestTables: true });

  if (!rowData.length) {
    throw new NotFoundException('Ticket not found.');
  }

  const eventData: any = {
    ...rowData[0].orders,
    ...rowData[0].event,
    ...rowData[0].event_location,
    orders_ticket_info: [],
  };
  const ordersTicketIds = new Set();

  for (const data of rowData) {
    if (
      data.orders_ticket_info.id &&
      !ordersTicketIds.has(data.orders_ticket_info.id)
    ) {
      eventData.orders_ticket_info.push({
        ...data.orders_ticket_info,
        event_ticket_name: data.event_ticket_info.name,
      });
      ordersTicketIds.add(data.orders_ticket_info.id);
    }
  }

  return eventData;
};
