import { render, screen } from '@testing-library/react';
import { Tag } from '.';

beforeEach(() => {
  render(<Tag>test</Tag>);
});

describe('when <Tag/> is mounted', () => {
  test('should display the content', () => {
    expect(screen.queryByText(/test/i)).toBeInTheDocument();
  });
});
