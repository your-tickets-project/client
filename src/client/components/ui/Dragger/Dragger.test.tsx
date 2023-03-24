import { fireEvent, render, screen } from '@testing-library/react';
import { Dragger } from '.';

const getDraggerElement = () => document.querySelector('.ui-dragger_dragger')!;
const getInputFileElement = () => document.querySelector('input')!;

describe('when <Dragger/> is mounted', () => {
  beforeEach(() => {
    render(
      <Dragger
        error
        fileList={[{ id: 1, imageSrc: 'https://example.com', name: 'test' }]}
        uploadInfo={[
          {
            id: 1,
            message: 'Upload information',
          },
        ]}
      />
    );
  });

  it(`should render the title`, () => {
    expect(
      screen.getByText(/Drag and drop or click here to upload an image./i)
    ).toBeInTheDocument();
  });

  it(`should render with error class`, () => {
    expect(getDraggerElement()).toHaveClass('error');
  });

  it(`should render the hidden input file`, () => {
    expect(getInputFileElement()).not.toBeVisible();
  });

  it(`should render the upload info`, () => {
    expect(screen.getByText('Upload information')).toBeInTheDocument();
  });

  it(`should render the file element`, () => {
    expect(screen.getByRole('img', { name: 'test' })).toBeInTheDocument();
  });
});

describe('when the user upload a file successfully', () => {
  const handleUpload = jest.fn();
  const handleDelete = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    render(
      <Dragger
        fileList={[{ id: 1, imageSrc: 'https://example.com', name: 'test' }]}
        onUpload={handleUpload}
        onDelete={handleDelete}
      />
    );
  });

  it('support drag file with over style', async () => {
    fireEvent.dragOver(getDraggerElement());
    expect(getDraggerElement()).toHaveClass('active');
  });

  it(`should call the onUpload function when the user drops a file`, () => {
    const file = new File(['(⌐□_□)'], 'test.png', { type: 'image/png' });
    fireEvent.drop(getDraggerElement(), {
      dataTransfer: {
        files: [file],
      },
    });
    expect(handleUpload).toHaveBeenCalledWith([file]);
  });

  it('should call the onUpload function when the user clicks on the component', () => {
    const file = new File(['(⌐□_□)'], 'test.png', { type: 'image/png' });
    fireEvent.change(getInputFileElement(), {
      target: { files: [file] },
    });
    expect(handleUpload).toHaveBeenCalledWith([file]);
  });

  it('should delete a file from the file list', () => {
    fireEvent.click(document.querySelectorAll('.ui-dragger_item-icon')[0]);
    expect(handleDelete).toHaveBeenCalledWith({ id: 1 });
  });
});

describe('when the component is disabled', () => {
  const handleUpload = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    render(<Dragger disabled fileList={[]} onUpload={handleUpload} />);
  });

  it('should not call the onUpload function when the user drops a file', () => {
    fireEvent.dragOver(getDraggerElement());
    expect(getDraggerElement()).not.toHaveClass('active');

    fireEvent.drop(getDraggerElement());
    expect(handleUpload).not.toHaveBeenCalled();
  });

  it('should not call the onUpload function when the user clicks on the component', () => {
    fireEvent.change(getInputFileElement());
    expect(handleUpload).not.toHaveBeenCalled();
  });
});

describe('when the component has validations', () => {
  const handleError = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    render(
      <Dragger
        accept={['image/png']}
        fileList={[]}
        maxCount={1}
        maxFileSize={0}
        onError={handleError}
      />
    );
  });

  test('should tests that an invalid file cannot be uploaded', () => {
    const file = new File(['(⌐□_□)'], 'test.jpg', {
      type: 'image/jpeg',
    });
    fireEvent.change(getInputFileElement(), {
      target: { files: [file] },
    });
    expect(handleError).toHaveBeenCalledWith({
      errorType: 'VALID_TYPE',
      file,
      message: `This file ${file.name} is not a valid file type`,
    });
  });

  it('should tests that an error is thrown when the maximum file count is exceeded', () => {
    const file = new File(['(⌐□_□)'], 'test.png', { type: 'image/png' });
    fireEvent.change(getInputFileElement(), {
      target: { files: [file, file] },
    });
    expect(handleError).toHaveBeenCalledWith({
      errorType: 'MAX_COUNT',
      message: `You can upload just 1 image`,
    });
  });
});
