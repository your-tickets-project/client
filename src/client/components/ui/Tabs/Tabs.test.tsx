import { fireEvent, render, screen } from '@testing-library/react';
import { Tabs } from '.';

beforeEach(() => {
  render(
    <Tabs
      items={[
        {
          key: '1',
          label: `label 1`,
          children: 'content 1',
        },
        {
          key: '2',
          label: `label 2`,
          children: `content 2`,
        },
      ]}
    />
  );
});

describe('when <Tabs/> is mounted', () => {
  test('should display the first item content', () => {
    expect(screen.getByText('content 1')).toBeInTheDocument();
  });
});

describe('when the user changes the tab', () => {
  test('should change the first item content to other item', () => {
    expect(screen.getByText('content 1')).toBeInTheDocument();

    fireEvent.click(screen.getAllByRole('listitem')[1]);

    expect(screen.queryByText('content 1')).not.toBeInTheDocument();
    expect(screen.getByText('content 2')).toBeInTheDocument();
  });
});
