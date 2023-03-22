import { fireEvent, render, screen } from '@testing-library/react';
import { Tag } from '.';

const handleClose = jest.fn();
beforeEach(() => {
  jest.clearAllMocks();
  render(
    <Tag closable onClose={handleClose}>
      test
    </Tag>
  );
});

describe('when <Tag/> is mounted', () => {
  test('should display the content', () => {
    expect(screen.queryByText(/test/i)).toBeInTheDocument();
  });
});

describe('when the user close the tag', () => {
  it(`should call the onClose function`, () => {
    fireEvent.click(document.querySelector('svg')!);
    expect(handleClose).toHaveBeenCalled();
  });
});
