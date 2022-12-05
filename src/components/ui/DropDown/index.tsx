import React, { useState } from 'react';

interface Props {
  children: React.ReactNode;
  items: { key: string | number; label: React.ReactNode | string }[];
}

export const DropDown = ({ children, items }: Props) => {
  const [isActive, setIsActive] = useState(false);

  return (
    <div className="ui-dropdown" onClick={() => setIsActive(!isActive)}>
      <div>{children}</div>
      <div className={`items ${isActive ? 'is-active' : 'is-not-active'}`}>
        {items.map(({ key, label }) => (
          <div key={key} className="item">
            {label}
          </div>
        ))}
      </div>
    </div>
  );
};
