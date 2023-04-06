/* eslint-disable camelcase */
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import toaster from 'react-hot-toast';
// components
import PrivateRoute from 'client/components/app/PrivateRoute';
import DashboardLayout from 'client/components/Layouts/DashboardLayout';
import EventFormLayout from 'client/components/app/event/EventFormLayout';
import TrixEditor from 'client/components/app/TrixEditor';
import Loader from 'client/components/app/Loader';
import { Button, Form, TextArea, Dragger } from 'client/components/ui';
// helpers
import { debounce, stringToHTML } from 'client/helpers';
// services
import { baseURL } from 'client/services';
import {
  getEventDetail,
  postEventDetail,
  putEventDetail,
} from 'client/services/event.service';
import { deleteMedia, postMedia } from 'client/services/media.service';
// styles
import { breakPoints } from 'client/styles/variables';

interface FileType {
  id: string | number;
  name: string;
  imageSrc: string;
  error?: boolean;
}

const parentScrollToSelector = '#event-form-layout';
let eventDetailId: number | null = null;

export default function EditDetailsPage() {
  return (
    <PrivateRoute>
      <DashboardLayout>
        <DetailFormWrapper />
      </DashboardLayout>
    </PrivateRoute>
  );
}

const DetailFormWrapper = () => {
  const router = useRouter();

  // booleans
  const [isLoading, setIsLoading] = useState(true);
  const [uploadError, setUploadError] = useState(false);
  const [isSending, setIsSending] = useState(false);
  // data
  const [eventId, setEventId] = useState<string | number>();
  const [eventDetail, setEventDetail] = useState<{
    id: string | number;
    summary: string;
  }>();
  const [fileList, setFileList] = useState<FileType[]>([]);
  const [descriptionInfo, setDescriptionInfo] = useState<string>('');
  const [editorFilesAmount, setEditorFilesAmount] = useState<number>(0);

  useEffect(() => {
    setIsLoading(false);
  }, []);

  useEffect(() => {
    if (isLoading) return;
    if (!router.isReady) return;

    const queryAPI = async () => {
      const { id } = router.query;
      try {
        const res = await getEventDetail({ eventId: id as string });
        setEventId(res.data.id);

        if (res.data.event_detail.id) {
          const { id, cover_image_url, description, summary } =
            res.data.event_detail;
          setEventDetail({
            id,
            summary: summary || '',
          });
          eventDetailId = id;
          if (cover_image_url) {
            setFileList([
              {
                id: cover_image_url,
                imageSrc: `${baseURL}/media/${cover_image_url}`,
                name: 'Main event image',
              },
            ]);
          }
          if (description) {
            setDescriptionInfo(description);
            const html = stringToHTML(description);
            const filesAmount = html.querySelectorAll('img');
            setEditorFilesAmount(filesAmount.length);
          }
        }
      } catch (error: any) {
        toaster.error(
          error?.response?.data?.message || 'Internal server error.'
        );

        setTimeout(() => {
          router.replace('/dashboard/events');
        }, 3000);
      }
    };
    queryAPI();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoading, router.isReady]);

  const handleError = ({ message }: { message: string }) => {
    toaster.error(message);
  };

  const handleDeleteFile = async ({ id }: { id: string | number }) => {
    if (eventId && eventDetail) {
      try {
        await deleteMedia({ Key: id });
        await putEventDetail({
          data: {
            cover_image_url: null,
          },
          eventId,
          eventDetailId: eventDetail.id,
        });

        setFileList((state) => state.filter((file) => file.id !== id));
      } catch (error: any) {
        toaster.error(
          error?.response?.data?.message || 'Internal server error.'
        );
      }
    }
  };

  const handleUploadFile = async (files: File[]) => {
    setUploadError(false);

    try {
      const res = await postMedia({ files });
      const { Key } = res.data.filesData[0];

      if (eventId) {
        if (!eventDetail) {
          const res = await postEventDetail({
            data: {
              cover_image_url: Key,
            },
            eventId,
          });
          setEventDetail({
            id: res.data.insertId,
            summary: '',
          });
          eventDetailId = res.data.insertId;
          setFileList([
            {
              id: Key,
              imageSrc: `${baseURL}/media/${Key}`,
              name: 'Main event image',
            },
          ]);
        } else {
          await putEventDetail({
            data: {
              cover_image_url: Key,
            },
            eventId,
            eventDetailId: eventDetail.id,
          });
          setFileList([
            {
              id: Key,
              imageSrc: `${baseURL}/media/${Key}`,
              name: 'Main event image',
            },
          ]);
        }
      }
    } catch (error: any) {
      toaster.error(error?.response?.data?.message || 'Internal server error.');
    }
  };

  const handleDeleteEditorFile = async ({
    editorElement,
    previewURL,
  }: {
    previewURL: string;
    editorElement: HTMLInputElement;
  }) => {
    try {
      const Key = previewURL.split('/').at(-1);
      if (eventDetailId && eventId && Key) {
        await deleteMedia({ Key });
        await putEventDetail({
          data: {
            description: editorElement.value || null,
          },
          eventId,
          eventDetailId,
        });
      }
    } catch (error: any) {
      toaster.error(error?.response?.data?.message || 'Internal server error.');
    }
  };

  const handleUploadEditorFile = async ({
    attachment,
    editorElement,
  }: {
    attachment: {
      file: File;
      setUploadProgress: (progress: number) => void;
      setAttributes: (attributes: { href: string; url: string }) => void;
    };
    editorElement: HTMLInputElement;
  }) => {
    try {
      const res = await postMedia({ files: [attachment.file] });
      const { Key } = res.data.filesData[0];
      const URI = `${baseURL}/media/${Key}`;
      attachment.setUploadProgress(100);
      attachment.setAttributes({
        href: URI,
        url: URI,
      });
      if (eventId) {
        if (!eventDetailId) {
          const res = await postEventDetail({
            data: {
              description: editorElement.value,
            },
            eventId,
          });
          setEventDetail({
            id: res.data.insertId,
            summary: '',
          });
          eventDetailId = res.data.insertId;
        } else {
          await putEventDetail({
            data: {
              description: editorElement.value,
            },
            eventId,
            eventDetailId,
          });
        }
      }
    } catch (error: any) {
      toaster.error(error?.response?.data?.message || 'Internal server error.');
    }
  };

  const handleFinish = async (values: { summary: string }) => {
    if (!fileList.length) {
      toaster.error('Main event image is required.');
      setUploadError(true);

      const $container = document.querySelector(
        parentScrollToSelector
      ) as HTMLElement | null;
      if ($container) {
        $container.scrollTo({
          top: 0,
          behavior: 'smooth',
        });
      }
      return;
    }

    setIsSending(true);
    setUploadError(false);
    try {
      if (eventId && eventDetail) {
        const res = await putEventDetail({
          data: {
            description: descriptionInfo || null,
            summary: values.summary,
          },
          eventId,
          eventDetailId: eventDetail.id,
        });
        setEventDetail((state) =>
          state ? { ...state, summary: values.summary } : state
        );
        toaster.success(res.data.message);
      }
    } catch (error: any) {
      toaster.error(error?.response?.data?.message || 'Internal server error.');
    }
    setIsSending(false);
  };

  if (!eventId) {
    return (
      <div
        style={{
          alignItems: 'center',
          display: 'flex',
          height: '100%',
          justifyContent: 'center',
        }}
      >
        <Loader />
      </div>
    );
  }

  return (
    <EventFormLayout>
      <div className="container">
        <Form
          extraOffsetTop={80}
          initialValues={
            eventDetail ? { summary: eventDetail.summary } : undefined
          }
          parentScrollToSelector={parentScrollToSelector}
          onFinish={debounce(handleFinish, 800)}
        >
          <div className="row hg-24">
            <div className="col-12 row hg-8">
              <div className="col-12">
                <h1>Main event image</h1>
                <p>
                  Add the photo to show what your event will be about. You can
                  upload just 1 image.
                </p>
              </div>
              <div className="col-12">
                <Dragger
                  accept={['image/jpg', 'image/jpeg', 'image/png']}
                  disabled={!!fileList.length}
                  error={uploadError}
                  fileList={fileList}
                  maxCount={1}
                  maxFileSize={10_485_760}
                  style={{ height: '250px' }}
                  uploadInfo={[
                    {
                      id: 1,
                      message: 'Recomended image size: 2160 x 1080px',
                    },
                    {
                      id: 2,
                      message: 'Maximun file size: 10MB',
                    },
                    {
                      id: 3,
                      message: 'Supported image files: JPEG, JPG, PNG',
                    },
                  ]}
                  onDelete={handleDeleteFile}
                  onError={debounce(handleError, 800)}
                  onUpload={handleUploadFile}
                />
              </div>
            </div>

            <div className="col-12 row hg-8">
              <div className="col-12">
                <h3>Summary</h3>
                <p>
                  Grab people&apos;s attention with a short description about
                  your event.
                </p>
              </div>
              <div className="col-12">
                <Form.Item
                  label="Summary"
                  name="summary"
                  rules={{
                    required: true,
                    max: 140,
                  }}
                >
                  <TextArea
                    style={{
                      height: '68px',
                      resize: 'none',
                    }}
                  />
                </Form.Item>
              </div>
            </div>

            <div className="col-12 row hg-8">
              <div className="col-12">
                <h3>Description</h3>
                <p>
                  Add more details to your event like your schedule, sponsors,
                  or featured guests. You can upload just 5 images.
                </p>
              </div>
              <div className="col-12">
                <TrixEditor
                  accept={['image/jpg', 'image/jpeg', 'image/png']}
                  filesAmount={editorFilesAmount}
                  maxCount={5}
                  maxFileSize={10_485_760}
                  toolbarOptions={{
                    actions: {
                      decreaseNestingLevel: false,
                      increaseNestingLevel: false,
                      redo: false,
                      undo: false,
                    },
                    attributes: {
                      code: false,
                      strike: false,
                    },
                  }}
                  uploadInfo={[
                    {
                      id: 1,
                      message: 'Maximun file size: 10MB',
                    },
                    {
                      id: 2,
                      message: 'Supported image files: JPEG, JPG, PNG',
                    },
                  ]}
                  value={descriptionInfo}
                  onChange={setDescriptionInfo}
                  onDelete={handleDeleteEditorFile}
                  onError={debounce(handleError, 800)}
                  onUpload={handleUploadEditorFile}
                />
              </div>
            </div>

            <div className="col-12">
              <Button
                block
                disabled={isSending}
                htmlType="submit"
                type="primary"
              >
                Save
              </Button>
            </div>
          </div>
        </Form>
      </div>
      <style jsx>{`
        @media (min-width: ${breakPoints.md}) {
          .container {
            width: 80%;
          }
        }
      `}</style>
    </EventFormLayout>
  );
};
