/* eslint-disable react/display-name */
/* eslint-disable @next/next/no-img-element */
import React, { useState } from 'react';

type AcceptFileTypes = 'image/png' | 'image/jpg' | 'image/jpeg';

interface FileType {
  id: string | number;
  name: string;
  imageSrc: string;
  error?: boolean;
}

interface Props {
  accept?: AcceptFileTypes[];
  disabled?: boolean;
  error?: boolean;
  fileList: FileType[];
  maxCount?: number;
  maxFileSize?: number;
  multiple?: boolean;
  style?: React.CSSProperties;
  uploadInfo?: { id: string | number; message: string }[];
  uploadRef?: React.LegacyRef<HTMLDivElement>;
  onDelete: (id: { id: string | number }) => void;
  onError?: ({
    file,
    message,
  }: {
    errorType: 'MAX_COUNT' | 'FILE_SIZE' | 'VALID_TYPE';
    file?: File;
    message: string;
  }) => void;
  onUpload: (files: File[]) => void;
}

// TODO: test
export const Dragger = ({
  accept,
  disabled,
  error,
  fileList,
  maxCount,
  maxFileSize,
  multiple,
  style,
  uploadInfo,
  uploadRef,
  onDelete,
  onError,
  onUpload,
}: Props) => {
  const [fileAmount, setFileAmount] = useState<number>(fileList.length);

  const validations = (files: File[]) => {
    if (maxCount && files.length + fileAmount > maxCount) {
      onError?.({
        errorType: 'MAX_COUNT',
        message: `You can upload just ${maxCount} image${
          maxCount === 1 ? '' : 's'
        }`,
      });
      return false;
    }

    for (const file of files) {
      if (maxFileSize && file.size > maxFileSize) {
        onError?.({
          errorType: 'FILE_SIZE',
          file,
          message: `This file ${file.name} passes the allowed size`,
        });
        return false;
      }

      if (accept && !accept.includes(file.type as AcceptFileTypes)) {
        onError?.({
          errorType: 'VALID_TYPE',
          file,
          message: `This file ${file.name} is not a valid file type`,
        });
        return false;
      }
    }
    return true;
  };

  const manageFiles = (files: File[]) => {
    if (!validations(files)) return;
    setFileAmount((state) => state + files.length);
    onUpload(files);
  };

  const handleInputFileChange = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    if (disabled) return;
    if (!e.target.files) return;

    const files = Array.from(e.target.files);
    manageFiles(files);

    e.target.value = '';
  };

  const handleDrop = async (e: React.DragEvent<HTMLDivElement>) => {
    if (disabled) return;

    e.preventDefault();
    e.stopPropagation();
    e.currentTarget.classList.remove('active');

    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const files = Array.from(e.dataTransfer!.files);
    manageFiles(files);
  };

  const handleDeleteFile = ({ id }: { id: string | number }) => {
    setFileAmount((state) => state - 1);
    onDelete({ id });
  };

  return (
    <div className="ui-dragger" ref={uploadRef}>
      <input
        accept={accept?.join(',')}
        className="ui-dragger_input-file"
        hidden
        name="file"
        type="file"
        onChange={handleInputFileChange}
        multiple={multiple}
      />
      <div
        className={`ui-dragger_dragger ${disabled ? 'disabled' : ''} ${
          error ? 'error' : ''
        }`}
        style={style}
        onClick={() => {
          if (disabled) return;
          document
            .querySelector<HTMLInputElement>('.ui-dragger_input-file')
            ?.click();
        }}
        onDragOver={(e) => {
          if (disabled) return;
          e.preventDefault();
          e.stopPropagation();
          e.currentTarget.classList.add('active');
        }}
        onDragLeave={(e) => {
          if (disabled) return;
          e.preventDefault();
          e.stopPropagation();
          e.currentTarget.classList.remove('active');
        }}
        onDrop={handleDrop}
      >
        <div className="ui-dragger_dragger-container">
          <div className="ui-dragger_icon">
            <PhotoIcon />
          </div>
          <p className="ui-dragger_info">
            Drag and drop or click here to upload an image.
          </p>
        </div>
      </div>
      {!!uploadInfo?.length && (
        <ul className="ui-dragger_upload-info">
          {uploadInfo.map(({ id, message }) => (
            <li key={id} className="ui-dragger_upload-info-item">
              {message}
            </li>
          ))}
        </ul>
      )}
      {!!fileList.length && (
        <div className="ui-dragger_file-list">
          {fileList.map((file) => (
            <div
              key={file.id}
              className={`ui-dragger_item ${file.error ? 'error' : ''}`}
            >
              <div className="ui-dragger_item-image">
                <img src={file.imageSrc} alt="image" />
              </div>
              <p className="ui-dragger_item-name">{file.name}</p>
              <div
                className="ui-dragger_item-icon"
                onClick={() => handleDeleteFile({ id: file.id })}
              >
                <GarbageTrashIcon />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

const GarbageTrashIcon = (props: { fill?: string }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <path
      d="M18 6v12a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2V6M4 6h16m-5 0V5a2 2 0 0 0-2-2h-2a2 2 0 0 0-2 2v1"
      stroke="#000"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const PhotoIcon = (props: { fill?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" {...props}>
    <path d="M0 45.178v421.644h512V45.178H0zm471.841 381.484H40.159V85.329h431.682v341.333z" />
    <path d="M326.128 207.728a22.41 22.41 0 0 0-37.43.031l-72.226 109.914-39.862-45.178a22.389 22.389 0 0 0-18.397-7.52 22.371 22.371 0 0 0-17.142 10.053L74.17 376.96h363.659L326.128 207.728zM174.972 230.713c25.102 0 45.453-20.35 45.453-45.461 0-25.102-20.35-45.452-45.453-45.452-25.11 0-45.46 20.35-45.46 45.452-.001 25.111 20.35 45.461 45.46 45.461z" />
  </svg>
);
