import { fireEvent, render, screen } from '@testing-library/react';
import { DropDown } from '.';

beforeEach(() => {
  render(
    <DropDown
      items={[
        { key: 1, item: 'item 1' },
        { key: 2, item: 'item 2' },
        { key: 3, item: 'item 3' },
        { key: 4, item: 'item 4' },
      ]}
    >
      Test
    </DropDown>
  );
});

describe('when <DropDown /> is mounted', () => {
  test('should display the content', () => {
    expect(screen.getByText(/test/i)).toBeInTheDocument();
  });
});

describe('when the user click to select an option', () => {
  test('should display the items', () => {
    const $optonsContainer = screen.getByRole('list');

    expect($optonsContainer.classList.contains('is-not-active')).toBeTruthy();

    fireEvent.click(screen.getByText(/test/i));

    expect($optonsContainer.classList.contains('is-active')).toBeTruthy();
  });
});
