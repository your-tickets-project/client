import fs from 'node:fs';
import path from 'node:path';
import PDFMerger from 'pdf-merger-js';
// @ts-ignore
import pdf from 'html-template-to-pdf';

interface Params {
  id: string | number;
  eventTitle: string;
  eventTicketInfoName: string;
  venueName: string;
  address: string;
  city: string;
  postalCode: string | number;
  country: string;
  eventStart: string;
  eventEnd: string;
  orderName: string;
  orderDate: string;
  imageUrl: string;
}

export const generateBufferTicketPdf = async (data: Params) => {
  const style = fs.readFileSync(path.join('src/templates/styles.css'), 'utf8');
  const arrayBuffer = await pdf(path.join('src/templates/ticket.html'), {
    style,
    ...data,
  });
  return Buffer.from(arrayBuffer);
};

export const mergeBufferPdf = async ({
  bufferFiles,
}: {
  bufferFiles: Buffer[];
}) => {
  const merger = new PDFMerger();

  for await (const b of bufferFiles) {
    await merger.add(b);
  }

  return merger.saveAsBuffer();
};
