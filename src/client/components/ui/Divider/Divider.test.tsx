import { render, screen } from '@testing-library/react';
import { Divider } from '.';

beforeEach(() => {
  render(<Divider />);
});

describe('when <Divider/> is mounted', () => {
  test('should display it correctly', () => {
    expect(screen.queryByTestId('ui-divider-element')).toBeInTheDocument();
  });
});
