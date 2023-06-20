import {
  DeleteObjectCommand,
  GetObjectCommand,
  PutObjectCommand,
  S3Client,
} from '@aws-sdk/client-s3';
import { MulterFileType } from 'interfaces';
// utils
import { generateId } from 'server/utils';

const accessKeyId = process.env.S3_ACCESS_KEY_ID!;
const Bucket = process.env.S3_BUCKET_NAME!;
const region = process.env.S3_REGION!;
const secretAccessKey = process.env.S3_SECRET_ACCESS_KEY!;

const s3 = new S3Client({
  region,
  credentials: {
    accessKeyId,
    secretAccessKey,
  },
});

/* GET
–––––––––––––––––––––––––––––––––––––––––––––––––– */
export const downloadMedia = async ({ Key }: { Key: string }) => {
  const command = new GetObjectCommand({ Bucket, Key });
  const response = await s3.send(command);
  const decoded = await response.Body!.transformToString('base64');
  return Buffer.from(decoded, 'base64');
};

/* POST
–––––––––––––––––––––––––––––––––––––––––––––––––– */
export const createMedia = async ({
  files,
  addOriginalName,
}: {
  files: MulterFileType[];
  addOriginalName?: boolean;
}) => {
  const uploadedFiles: { Key: string; name: string }[] = [];
  for await (const file of files) {
    let Key = generateId();
    if (addOriginalName) {
      Key = `${file.originalname}-${Key}`;
    }
    const command = new PutObjectCommand({ Bucket, Body: file.buffer, Key });
    await s3.send(command);
    uploadedFiles.push({ Key, name: file.originalname });
  }
  return uploadedFiles;
};

/* DELETE
–––––––––––––––––––––––––––––––––––––––––––––––––– */
export const removeMedia = async ({ Key }: { Key: string }) => {
  const command = new DeleteObjectCommand({
    Bucket,
    Key,
  });
  return s3.send(command);
};
