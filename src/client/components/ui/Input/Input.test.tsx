import { fireEvent, render, screen } from '@testing-library/react';
import { Input } from '.';

describe('when <Input/> is mounted', () => {
  const handleChange = jest.fn();
  beforeEach(() => {
    jest.clearAllMocks();

    render(
      <Input
        addonBefore="addon-before"
        error
        maxLength={10}
        placeholder="test"
        showCount
        type="text"
        value="test value test"
        onChange={handleChange}
      />
    );
  });

  it(`should have the max count value`, () => {
    expect(screen.getByTestId('ui-input_input-element')).toHaveValue(
      'test value'
    );

    expect(screen.getByTestId('ui-input_input-element')).not.toHaveValue(
      'test value test'
    );
  });

  it('should render the addon before element', () => {
    expect(screen.getByText('addon-before')).toBeInTheDocument();
  });

  it('should render the input with error class', () => {
    expect(
      screen.getByTestId('ui-input_input-element')?.classList.contains('error')
    ).toBeTruthy();
  });

  it(`should render the counter and the max count number`, () => {
    expect(screen.getByText('10 / 10'));
  });
});

describe('when the user types', () => {
  it('should call the onChange function', () => {
    const handleChange = jest.fn();
    render(<Input type="text" onChange={handleChange} />);

    fireEvent.change(screen.getByTestId('ui-input_input-element'), {
      target: { value: 'test' },
    });

    expect(handleChange).toHaveBeenCalled();
  });

  it(`should not call the onChange function when is disabled`, () => {
    const handleChange = jest.fn();
    render(<Input disabled type="text" onChange={handleChange} />);

    fireEvent.change(screen.getByRole('textbox'), {
      target: { value: 'test' },
    });

    expect(handleChange).not.toHaveBeenCalled();
  });
});
