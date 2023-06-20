import sgMail from '@sendgrid/mail';

sgMail.setApiKey(process.env.SG_EMAIL_API_KEY!);

interface Params {
  to: string;
  subject: string;
  text: string;
  attachments: {
    content: Buffer;
    filename: string;
    type: string;
    disposition: string;
  }[];
}

export const sendEmail = ({ attachments, subject, text, to }: Params) => {
  return sgMail.send({
    to,
    from: { name: 'YourTickets', email: process.env.SG_EMAIL_FROM! },
    subject,
    text,
    attachments: attachments.map(
      ({ content, disposition, filename, type }) => ({
        content: content.toString('base64'),
        disposition,
        filename,
        type,
      })
    ),
  });
};
