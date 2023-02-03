import { fireEvent, render, screen } from '@testing-library/react';
import { Input } from '.';

const handleChange = jest.fn();

beforeEach(() => {
  jest.clearAllMocks();

  render(
    <Input
      type="text"
      error
      addonBefore="addon-before"
      placeholder="test"
      onChange={handleChange}
    />
  );
});

describe('when <Input/> is mounted', () => {
  test('should render the addon before element', () => {
    expect(screen.getByText('addon-before')).toBeInTheDocument();
  });

  test('should render the input with error class', () => {
    expect(
      screen.getByTestId('ui-input-input-element')?.classList.contains('error')
    ).toBeTruthy();
  });
});

describe('when the user types', () => {
  test('should call the onChange function', () => {
    fireEvent.change(screen.getByTestId('ui-input-input-element'), {
      target: { value: 'test' },
    });

    expect(handleChange).toHaveBeenCalled();
  });
});
