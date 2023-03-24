/* eslint-disable @next/next/no-img-element */
import React from 'react';

interface Props {
  cover?: React.ReactNode;
  title?: React.ReactNode;
  children: React.ReactNode;
  hoverable?: boolean;
  style?: React.CSSProperties;
}

const HeartIcon = (props: { fill?: string }) => (
  <svg viewBox="0 0 24 24" xmlSpace="preserve" {...props}>
    <title>heart-icon</title>
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M21 8c0 1.7-.4 2.4-1.7 3.8L12 19.1l-7.3-7.3C3.3 10.4 3 9.7 3 8c0-2.3 1.9-4 4.5-4 3 0 4.5 3.5 4.5 3.5S13.5 4 16.5 4C19 4 21 5.7 21 8m-4.5-5C13.2 3 12 5.5 12 5.5S10.2 3 7.5 3C4.5 3 2 5 2 8c0 2 .5 3 2 4.5l8 8 8-8C21.5 11 22 10 22 8c0-3-2.5-5-5.5-5"
    />
  </svg>
);

export const Card = ({ cover, title, children, hoverable, style }: Props) => {
  return (
    <article
      className={`ui-card ${hoverable ? 'hoverable' : ''}`}
      style={style}
    >
      <div className="ui-card_header">
        {cover && (
          <div className="ui-card_cover">
            {' '}
            <div className="ui-card_like-button">
              <HeartIcon />
            </div>
            {cover}
          </div>
        )}
        {title && <div className="ui-card_title">{title}</div>}
      </div>
      <aside className="ui-card_body">{children}</aside>
    </article>
  );
};
