import { fireEvent, render, screen } from '@testing-library/react';
import { Select } from '.';

const handleChange = jest.fn();

beforeEach(() => {
  jest.clearAllMocks();

  render(
    <Select
      value="1"
      name="testName"
      placeholder="test placeholder"
      options={[
        { key: 1, label: 'Venezuela', value: '1' },
        { key: 2, label: 'Mexico', value: '2' },
        { key: 3, label: 'USA', value: '3' },
      ]}
      onChange={handleChange}
    />
  );
});

describe('when <Select/> is mounted', () => {
  test('should display the label', () => {
    expect(screen.getByRole('combobox')).toHaveValue('Venezuela');
  });

  test('should display the placeholder', () => {
    expect(screen.getByPlaceholderText('test placeholder')).toBeInTheDocument();
  });

  test('should display the options', () => {
    const $optionsElement = screen.getByRole('list');

    expect($optionsElement.classList.contains('is-not-active')).toBeTruthy();

    fireEvent.click(screen.getByRole('combobox'));

    expect($optionsElement.classList.contains('is-active')).toBeTruthy();
  });
});

describe('when the user change the value', () => {
  test('should call the onChange function when it is rendered', () => {
    expect(handleChange).toHaveBeenCalledWith({
      target: { name: 'testName', value: '1' },
    });
  });

  test('should change the value', () => {
    const $select = screen.getByRole('combobox');
    expect($select).toHaveValue('Venezuela');

    fireEvent.click($select);
    fireEvent.click(screen.getAllByRole('listitem')[1]);

    expect($select).toHaveValue('Mexico');
  });

  test('should call the onChange function when the user change the value', () => {
    expect(handleChange).toHaveBeenCalledWith({
      target: { name: 'testName', value: '1' },
    });

    fireEvent.click(screen.getByRole('combobox'));
    fireEvent.click(screen.getAllByRole('listitem')[2]);

    expect(handleChange).toHaveBeenCalledWith({
      target: { name: 'testName', value: '3' },
    });
  });
});
