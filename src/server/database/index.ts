import { escape, OkPacket, RowDataPacket } from 'mysql2';
import { db } from './config';

interface SelectParams {
  query: string;
  queryIdentifiers?: string[];
  queryValues?: (string | number | null)[];
  nestTables?: boolean;
}

interface InsertParams {
  query: string;
  data?: any;
}

interface UpdateParams {
  query: string;
  data?: any;
  queryValues?: (string | number | null)[];
}

interface DeleteParams {
  query: string;
  queryValues?: (string | number | null)[];
}

export const dbSelect = async <T = any>({
  query,
  queryIdentifiers,
  queryValues,
  nestTables,
}: SelectParams): Promise<T> => {
  const values: any = [];
  if (queryIdentifiers) {
    values.push(queryIdentifiers);
  } else {
    query = query.replace('??', '*');
  }
  if (queryValues) {
    values.push(...queryValues);
  }

  const [result] = await db.query<RowDataPacket[]>(
    { sql: query, nestTables },
    values
  );
  return result as any as T;
};

export const dbInsert = async ({ query, data }: InsertParams) => {
  const values: any = [];
  if (data) {
    values.push(data);
  }
  const [result] = await db.query<OkPacket>({ sql: query }, values);
  return result;
};

export const dbUpdate = async ({
  query,
  data,
  queryValues = [],
}: UpdateParams) => {
  const values: any = [];
  if (data) {
    values.push(data);
  }
  if (queryValues.length) {
    values.push(...queryValues);
  }

  const [result] = await db.query<OkPacket>({ sql: query }, values);
  return result;
};

export const dbDelete = async ({ query, queryValues = [] }: DeleteParams) => {
  const values = [];
  if (queryValues.length) {
    values.push(...queryValues);
  }
  const [result] = await db.query<OkPacket>({ sql: query }, values);
  return result;
};

export const dbEscapeChars = ({ value }: { value: string }) => {
  return escape(value).slice(1, -1);
};
