import React, { useEffect, useRef, useState } from 'react';

interface Props {
  children: React.ReactNode;
  items: { key: string | number; item: React.ReactNode | string }[];
  style?: React.CSSProperties;
}

export const DropDown = ({ children, items, style }: Props) => {
  const ref = useRef<HTMLDivElement>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    setIsLoading(false);
  }, []);

  useEffect(() => {
    if (isLoading) return;

    window.addEventListener('click', (e) => {
      if (!e.target) return;
      // @ts-ignore
      if (!ref.current?.contains(e.target)) setIsActive(false);
    });
  }, [isLoading]);

  return (
    <div
      className="ui-dropdown"
      ref={ref}
      style={style}
      onClick={() => setIsActive(!isActive)}
    >
      <div>{children}</div>
      {!!items.length && (
        <ul
          className={`ui-dropdown_items ${isActive ? 'active' : 'not-active'}`}
        >
          {items.map(({ key, item }) => (
            <li key={key} className="ui-dropdown_item">
              {item}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};
