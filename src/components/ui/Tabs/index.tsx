import React, { useEffect, useState } from 'react';

type Item = {
  key: string | number;
  label: string;
  children: React.ReactNode | string;
};

interface Props {
  items: Item[];
}

export const Tabs = ({ items }: Props) => {
  const [active, setActive] = useState<null | Item>(null);

  useEffect(() => {
    setActive(items[0]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <ul className="ui-tabs">
        {items.map(({ key, label, children }) => (
          <li
            key={key}
            className={`tab ${
              active?.key === key ? 'is-active' : 'is-not-active'
            }`}
            onClick={() => setActive({ key, label, children })}
          >
            {label}
          </li>
        ))}
      </ul>
      <div className="active-content">{active && active.children}</div>
    </>
  );
};
