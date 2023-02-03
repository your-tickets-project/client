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
  const [active, setActive] = useState<null | Item>(null);

  useEffect(() => {
    if (!items.length) return;
    setActive(items[0]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="ui-tabs">
      {!!items.length && (
        <ul className="ui-tabs-container">
          {items.map(({ key, label, children }) => (
            <li
              key={key}
              className={`ui-tabs-tab ${
                active?.key === key ? 'is-active' : 'is-not-active'
              }`}
              onClick={() => setActive({ key, label, children })}
            >
              {label}
            </li>
          ))}
        </ul>
      )}
      <div className="ui-tabs-active">{active && active.children}</div>
    </div>
  );
};
