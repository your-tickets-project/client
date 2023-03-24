import React, { useEffect, useState } from 'react';
import { Button, Input, Tag } from '../index';

interface Props {
  disabled?: boolean;
  maxLength?: number;
  maxTags?: number;
  placeholder?: string;
  showCount?: boolean;
  showTagsCount?: boolean;
  tagsValue?: string[];
  onTags?: (tags: string[]) => void;
}

export const InputTag = ({
  disabled,
  maxLength,
  maxTags,
  placeholder,
  showCount,
  showTagsCount,
  tagsValue,
  onTags,
}: Props) => {
  const [isLoading, setIsLoading] = useState(true);
  const [value, setValue] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [error, setError] = useState('');

  useEffect(() => {
    setIsLoading(false);
  }, []);

  useEffect(() => {
    if (isLoading) return;
    setError('');
    onTags?.(tags);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoading, tags]);

  useEffect(() => {
    if (isLoading) return;
    if (!tagsValue?.length) return;

    if (maxTags && tagsValue.length > maxTags) {
      setTags(tagsValue.slice(0, maxTags));
      setError('Tag limit reached.');
    } else {
      setTags(tagsValue);
    }
  }, [isLoading, maxTags, tagsValue]);

  return (
    <div className="ui-input-tag">
      <div className="ui-input-tag_container">
        <div className="ui-input-tag_input">
          <Input
            disabled={disabled}
            error={!!error.length}
            maxLength={maxLength}
            placeholder={placeholder}
            showCount={showCount}
            value={value}
            onChange={(e) => setValue(e.target.value)}
          />
        </div>
        <div className="ui-input-tag_button">
          <Button
            block
            disabled={disabled}
            style={{ height: '100%' }}
            onClick={() => {
              if (!value.length) return;

              if (maxTags && tags.length >= maxTags) {
                setError('Tag limit reached');
                return;
              }
              if (tags.includes(value)) {
                setError('Tag already exists');
                return;
              }

              setTags((state) => [...state, value]);
              setValue('');
              setError('');
            }}
          >
            Add
          </Button>
        </div>
      </div>
      {error.length ? (
        <div className="ui-input-tag_error-container">
          <span>{error}</span>
        </div>
      ) : (
        <>
          {showTagsCount && (
            <div className="ui-input-tag_counter-container">
              <span>
                {tags.length}
                {maxTags ? ` / ${maxTags}` : ''} tag{tags.length > 1 ? 's' : ''}
              </span>
            </div>
          )}
        </>
      )}
      <div className="ui-input-tag-tags">
        {tags.map((tag) => (
          <Tag
            closable
            key={tag}
            style={{ marginRight: '1rem' }}
            onClose={() => setTags((state) => state.filter((t) => t !== tag))}
          >
            {tag}
          </Tag>
        ))}
      </div>
    </div>
  );
};
