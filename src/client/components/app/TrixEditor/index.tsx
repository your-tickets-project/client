import React, { useEffect, useState } from 'react';
import { TrixEditor as Trixeditor } from 'react-trix';
// helpers
import { debounce } from 'client/helpers';

type AcceptFileTypes = 'image/png' | 'image/jpg' | 'image/jpeg';

interface Props {
  accept?: AcceptFileTypes[];
  filesAmount?: number;
  maxCount?: number;
  maxFileSize?: number;
  toolbarOptions?: {
    attributes?: {
      bold?: boolean;
      italic?: boolean;
      strike?: boolean;
      heading1?: boolean;
      quote?: boolean;
      code?: boolean;
      bullet?: boolean;
      number?: boolean;
    };
    actions?: {
      link?: boolean;
      decreaseNestingLevel?: boolean;
      increaseNestingLevel?: boolean;
      attachFiles?: boolean;
      undo?: boolean;
      redo?: boolean;
    };
  };
  uploadInfo?: { id: string | number; message: string }[];
  value?: string;
  onChange?: (html: string) => void;
  onDelete?: (e: {
    attachment: {
      file: File;
      setUploadProgress: (progress: number) => void;
      setAttributes: (attributes: { href: string; url: string }) => void;
    };
    editorElement: HTMLInputElement;
    previewURL: string;
  }) => void;
  onError?: ({
    file,
    message,
  }: {
    errorType: 'MAX_COUNT' | 'FILE_SIZE' | 'VALID_TYPE';
    file?: File;
    message: string;
  }) => void;
  onUpload?: (e: {
    attachment: {
      file: File;
      setUploadProgress: (progress: number) => void;
      setAttributes: (attributes: { href: string; url: string }) => void;
    };
    editorElement: HTMLInputElement;
  }) => void;
}

let fileAmount = 0;

// TODO: test
export default function TrixEditor({
  accept,
  filesAmount,
  maxCount,
  maxFileSize,
  toolbarOptions,
  uploadInfo,
  value,
  onChange,
  onDelete,
  onError,
  onUpload,
}: Props) {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(false);
  }, []);

  useEffect(() => {
    if (isLoading) return;
    addEventListener('trix-file-accept', (e: any) => {
      if (maxCount && fileAmount + 1 + (filesAmount || 0) > maxCount) {
        onError?.({
          errorType: 'MAX_COUNT',
          message: `You can upload just ${maxCount} image${
            maxCount === 1 ? '' : 's'
          }`,
        });
        e.preventDefault();
      }

      if (maxFileSize && e.file.size > maxFileSize) {
        onError?.({
          errorType: 'FILE_SIZE',
          file: e.file,
          message: `This file ${e.file.name} passes the allowed size`,
        });
        e.preventDefault();
      }

      if (accept && !accept.includes(e.file.type as AcceptFileTypes)) {
        onError?.({
          errorType: 'VALID_TYPE',
          file: e.file,
          message: `This file ${e.file.name} is not a valid file type`,
        });
        e.preventDefault();
      }
      fileAmount++;
    });

    addEventListener('trix-attachment-add', (e: any) => {
      if (e.attachment.file) {
        onUpload?.({
          attachment: e.attachment,
          editorElement: e.target,
        });
      }
    });

    addEventListener('trix-attachment-remove', (e: any) => {
      fileAmount--;
      const previewURL = e.attachment.attachment.previewURL;
      onDelete?.({
        attachment: e.attachment,
        editorElement: e.target,
        previewURL,
      });
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoading]);

  const handleChange = (html: string) => onChange?.(html);

  const handleEditorReady = (editor: any) => {
    if (toolbarOptions) {
      const toolbar = editor.element.editorController.toolbarController;
      toolbar.element.querySelector(`.trix-button-group-spacer`)?.remove();

      if (toolbarOptions.attributes) {
        const update: any = {};

        for (const [key, value] of Object.entries(toolbarOptions.attributes)) {
          if (value === false) {
            toolbar.element
              .querySelector(`button[data-trix-attribute="${key}"]`)
              ?.remove();

            update[key] = value;
          }
        }

        toolbar.updateAttributes(update);
      }

      if (toolbarOptions.actions) {
        const update: any = {};

        for (const [key, value] of Object.entries(toolbarOptions.actions)) {
          if (value === false) {
            toolbar.element
              .querySelector(`button[data-trix-action="${key}"]`)
              ?.remove();

            update[key] = value;
          }
        }

        if (update.attachFiles === false) {
          toolbar.element
            .querySelector(`[data-trix-button-group="file-tools"]`)
            ?.remove();
        }

        if (update.redo === false && update.undo === false) {
          toolbar.element
            .querySelector(`[data-trix-button-group="history-tools"]`)
            ?.remove();
        }

        toolbar.updateActions(update);
      }
    }
  };

  return (
    <div className="editor">
      <Trixeditor
        value={value}
        mergeTags={[]}
        onChange={debounce(handleChange, 800)}
        onEditorReady={debounce(handleEditorReady, 800)}
      />
      {!!uploadInfo?.length && (
        <ul className="editor-upload-info">
          {uploadInfo.map(({ id, message }) => (
            <li key={id} className="editor-upload-info-item">
              {message}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
