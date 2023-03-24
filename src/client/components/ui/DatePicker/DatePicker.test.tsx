import { fireEvent, render, screen } from '@testing-library/react';
import { DatePicker } from '.';

jest.spyOn(console, 'warn');
const handleChange = jest.fn();

beforeEach(() => {
  jest.clearAllMocks();

  render(<DatePicker error value="2023-03-01" onChange={handleChange} />);
});

describe('when <DatePicker /> is mounted', () => {
  it('should render correctly', () => {
    expect(screen.getByTestId('ui-date-picker-element')).toBeInTheDocument();
  });

  it('should render with a error class ', () => {
    expect(
      screen
        .getByTestId('ui-date-picker-element')
        .querySelector('.react-date-picker')
        ?.classList.contains('error')
    ).toBeTruthy();
  });
});

describe('when the user types', () => {
  test('should call the onChange function', () => {
    const $datePicker = screen.getByTestId('ui-date-picker-element');
    fireEvent.click(
      $datePicker.querySelector('.react-date-picker__clear-button')!
    );
    expect(handleChange).toHaveBeenCalledWith({
      target: { name: undefined, value: '' },
    });
  });
});
