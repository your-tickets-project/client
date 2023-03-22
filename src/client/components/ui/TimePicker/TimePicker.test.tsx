import { fireEvent, render, screen } from '@testing-library/react';
import { TimePicker } from '.';

jest.spyOn(console, 'warn');
const handleChange = jest.fn();

beforeEach(() => {
  jest.clearAllMocks();

  render(<TimePicker error value="18:00:00" onChange={handleChange} />);
});

describe('when <TimePicker /> is mounted', () => {
  it('should render correctly', () => {
    expect(screen.getByTestId('ui-time-picker-element')).toBeInTheDocument();
  });

  it('should render with a error class ', () => {
    expect(
      screen
        .getByTestId('ui-time-picker-element')
        .querySelector('.react-time-picker')
        ?.classList.contains('error')
    ).toBeTruthy();
  });
});

describe('when the user types', () => {
  test('should call the onChange function', () => {
    const $datePicker = screen.getByTestId('ui-time-picker-element');
    fireEvent.click(
      $datePicker.querySelector('.react-time-picker__clear-button')!
    );
    expect(handleChange).toHaveBeenCalledWith({
      target: { name: undefined, value: '' },
    });
  });
});
