import { render, screen } from '@testing-library/react';
import { Card } from '.';

describe('when <Card /> is mounted', () => {
  beforeEach(() => {
    render(
      <Card cover="cover" title="title" hoverable>
        card test content
      </Card>
    );
  });

  test('should render the cover, the title, and the icon', () => {
    expect(screen.getByText(/cover/i)).toBeInTheDocument();
    expect(screen.getByTitle(/heart-icon/i)).toBeInTheDocument();
    expect(screen.getByText(/title/i)).toBeInTheDocument();
    expect(screen.getByText(/card test content/i)).toBeInTheDocument();
  });

  test('should have the hoverable class active', () => {
    expect(
      screen.getByRole('article').classList.contains('hoverable')
    ).toBeTruthy();
  });
});
