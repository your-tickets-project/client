import React, { useState } from 'react';

interface Props {
  children: React.ReactNode;
  items: { key: string | number; item: React.ReactNode | string }[];
  style?: React.CSSProperties;
}

export const DropDown = ({ children, items, style }: Props) => {
  const [isActive, setIsActive] = useState(false);

  return (
    <div
      className="ui-dropdown"
      style={style}
      onClick={() => setIsActive(!isActive)}
    >
      <div>{children}</div>
      {!!items.length && (
        <ul
          className={`ui-dropdown-items ${
            isActive ? 'is-active' : 'is-not-active'
          }`}
        >
          {items.map(({ key, item }) => (
            <li key={key} className="ui-dropdown-item">
              {item}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};
