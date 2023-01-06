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
      <div className={`items ${isActive ? 'is-active' : 'is-not-active'}`}>
        {items.map(({ key, item }) => (
          <div key={key} className="item">
            {item}
          </div>
        ))}
      </div>
    </div>
  );
};
