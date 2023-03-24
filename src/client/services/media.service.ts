import { AxiosResponse } from 'axios';
import API from './index';

/* POST
–––––––––––––––––––––––––––––––––––––––––––––––––– */
export const postMedia = async ({
  files,
}: {
  files: File[];
}): Promise<
  AxiosResponse<{ filesData: { Key: string; name: string }[]; message: string }>
> => {
  const formData = new FormData();
  for (let i = 0; i < files.length; i++) {
    formData.append(`file_${i + 1}`, files[i]);
  }

  return API.post('/media', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
};

/* DELETE
–––––––––––––––––––––––––––––––––––––––––––––––––– */
export const deleteMedia = async ({
  Key,
}: {
  Key: string | number;
}): Promise<AxiosResponse<{ message: string }>> => API.delete(`/media/${Key}`);
