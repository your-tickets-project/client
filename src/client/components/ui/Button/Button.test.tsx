import { fireEvent, render, screen } from '@testing-library/react';
import { Button } from '.';

describe('when <Button/> is mounted', () => {
  test('should show the icon', () => {
    render(<Button icon="Icon">Follow</Button>);
    expect(screen.getByText(/icon/i)).toBeInTheDocument();
  });

  test('should not show the icon', () => {
    render(<Button>Follow</Button>);
    expect(
      screen.queryByTestId('ui-button_icon-element')
    ).not.toBeInTheDocument();
  });
});

describe('when the user click the button', () => {
  test('should call the onClick function', () => {
    const onClick = jest.fn();
    render(<Button onClick={onClick}>Follow</Button>);

    fireEvent.click(screen.getByText('Follow'));

    expect(onClick).toHaveBeenCalled();
  });
});
