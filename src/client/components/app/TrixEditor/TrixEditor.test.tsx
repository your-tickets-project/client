import { render, screen } from '@testing-library/react';
import TrixEditor from '.';

describe('when <TrixEditor/> is mounted', () => {
  beforeEach(() => {
    render(
      <TrixEditor
        uploadInfo={[{ id: 1, message: 'upload information' }]}
        value="<p>Hello World</p>"
      />
    );
  });

  it('should render the upload info prop', () => {
    expect(screen.getByText('upload information')).toBeInTheDocument();
  });

  it(`should have the value`, () => {
    expect(document.querySelector('input')).toHaveValue('<p>Hello World</p>');
  });
});

describe('when the user upload a file', () => {
  it('should add the file EventListeners', () => {
    window.addEventListener = jest.fn();

    render(<TrixEditor />);

    expect(window.addEventListener).toHaveBeenCalledWith(
      'trix-file-accept',
      expect.any(Function)
    );
    expect(window.addEventListener).toHaveBeenCalledWith(
      'trix-attachment-add',
      expect.any(Function)
    );
    expect(window.addEventListener).toHaveBeenCalledWith(
      'trix-attachment-remove',
      expect.any(Function)
    );
  });
});
