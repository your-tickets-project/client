import { NextApiResponse } from 'next';
import { NextApiRequestExtended } from 'server/router';
// data
import {
  createMedia,
  downloadMedia,
  removeMedia,
} from 'server/data/media/media.data';
// http status codes
import { OK_STATUS } from 'server/constants/http.status';
import { BadRequestException } from 'server/exceptions';

/* GET
–––––––––––––––––––––––––––––––––––––––––––––––––– */
export const getMedia = async (
  req: NextApiRequestExtended,
  res: NextApiResponse
) => {
  if (!req.query.key) {
    throw new BadRequestException('Key is required.');
  }

  const bufferFile = await downloadMedia({ Key: req.query.key as string });
  res.status(OK_STATUS).end(bufferFile);
};

/* POST
–––––––––––––––––––––––––––––––––––––––––––––––––– */
export const postMedia = async (
  req: NextApiRequestExtended,
  res: NextApiResponse
) => {
  const files = req.files!;
  const filesData = await createMedia({ files });
  res
    .status(OK_STATUS)
    .json({ message: 'Media uploaded successfully.', filesData });
};

/* DELETE
–––––––––––––––––––––––––––––––––––––––––––––––––– */
export const deleteMedia = async (
  req: NextApiRequestExtended,
  res: NextApiResponse
) => {
  if (!req.query.key) {
    throw new BadRequestException('Key is required.');
  }

  await removeMedia({ Key: req.query.key as string });
  res.status(OK_STATUS).json({ message: 'Media deleted successfully.' });
};
