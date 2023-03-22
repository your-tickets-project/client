import React, { useEffect, useState } from 'react';

interface Item {
  key: string | number;
  label: string;
  children: React.ReactNode | string;
}

interface Props {
  items: Item[];
}

export const Tabs = ({ items }: Props) => {
  const [active, setActive] = useState<Item | undefined>();

  useEffect(() => {
    if (!items.length) return;
    setActive(items[0]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="ui-tabs">
      {!!items.length && (
        <ul className="ui-tabs_container">
          {items.map(({ key, label, children }) => (
            <li
              key={key}
              className={`ui-tabs_tab ${
                active?.key === key ? 'active' : 'not-active'
              }`}
              onClick={() => setActive({ key, label, children })}
            >
              {label}
            </li>
          ))}
        </ul>
      )}
      <div className="ui-tabs_active">{active && active.children}</div>
    </div>
  );
};
