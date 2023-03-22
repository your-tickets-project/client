import { fireEvent, render, screen } from '@testing-library/react';
import { InputTag } from '.';

describe('when the <InputTag/> is mounted', () => {
  beforeEach(() => {
    render(
      <InputTag
        maxLength={10}
        maxTags={3}
        placeholder="test"
        showCount
        showTagsCount
        tagsValue={['tag 1', 'tag 2']}
      />
    );
  });

  it(`should render an input and a button`, () => {
    expect(screen.getByRole('textbox')).toBeInTheDocument();
    expect(screen.getByRole('button')).toBeInTheDocument();
  });

  it(`should render the max tags number and the amount of tags`, () => {
    expect(screen.getByText('2 / 3 tags')).toBeInTheDocument();
  });

  it(`should render the tags`, () => {
    expect(screen.getByText('tag 1')).toBeInTheDocument();
    expect(screen.getByText('tag 2')).toBeInTheDocument();
  });
});

describe('when the user uses the component', () => {
  const handleTags = jest.fn();
  beforeEach(() => {
    jest.clearAllMocks();
    render(
      <InputTag
        maxLength={10}
        maxTags={3}
        placeholder="test"
        showCount
        showTagsCount
        tagsValue={['tag 1', 'tag 2']}
        onTags={handleTags}
      />
    );
  });

  it(`should add a new tag`, () => {
    fireEvent.change(screen.getByRole('textbox'), {
      target: { value: 'tag 3' },
    });
    fireEvent.click(screen.getByRole('button'));
    expect(screen.getByText('tag 3')).toBeInTheDocument();
    expect(handleTags).toHaveBeenCalled();
  });

  it(`should remove one tag`, () => {
    fireEvent.click(document.querySelectorAll('svg')[0]);
    expect(screen.queryByText('tag 1')).not.toBeInTheDocument();
    expect(handleTags).toHaveBeenCalled();
  });

  it(`should not add the same tag value`, () => {
    expect(screen.getByText('2 / 3 tags')).toBeInTheDocument();

    fireEvent.change(screen.getByRole('textbox'), {
      target: { value: 'tag 1' },
    });
    fireEvent.click(screen.getByRole('button'));

    expect(screen.getByText('Tag already exists')).toBeInTheDocument();
    expect(screen.queryByText('2 / 3 tags')).not.toBeInTheDocument();
  });

  it(`should not add new tag when limit is reached`, () => {
    const $input = screen.getByRole('textbox');
    const $button = screen.getByRole('button');
    fireEvent.change($input, {
      target: { value: 'tag 3' },
    });
    fireEvent.click($button);

    expect(screen.getByText('3 / 3 tags')).toBeInTheDocument();
    fireEvent.change($input, {
      target: { value: 'tag 4' },
    });
    fireEvent.click($button);
    expect(screen.getByText('Tag limit reached')).toBeInTheDocument();
    expect(screen.queryByText('3 / 3 tags')).not.toBeInTheDocument();
  });
});
