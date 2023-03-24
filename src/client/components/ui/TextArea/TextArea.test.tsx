import { fireEvent, render, screen } from '@testing-library/react';
import { TextArea } from '.';

const getTextArea = () => screen.getByTestId('ui-textarea_textarea-element');

describe('when <TextArea/> is mounted', () => {
  beforeEach(() => {
    render(<TextArea error showCount maxLength={10} />);
  });

  it(`should render correctly`, () => {
    expect(getTextArea()).toBeInTheDocument();
  });

  it(`should render with error class`, () => {
    expect(getTextArea()?.classList.contains('error')).toBeTruthy();
  });

  it(`should render the counter and the max count number`, () => {
    expect(screen.getByText('0 / 10'));
  });
});

describe('when the user uses the component', () => {
  const handleChange = jest.fn();
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it(`should have the value`, () => {
    render(
      <TextArea
        showCount
        maxLength={10}
        value="test value"
        onChange={handleChange}
      />
    );
    expect(getTextArea()).toHaveValue('test value');
  });

  it(`should not call the onChange function when is disabled`, () => {
    render(<TextArea disabled onChange={handleChange} />);

    fireEvent.change(getTextArea(), { target: { value: 'new value' } });

    expect(handleChange).not.toHaveBeenCalled();
  });
});
