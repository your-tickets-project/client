import React from 'react';

interface Props {
  block?: boolean;
  children?: React.ReactNode;
  htmlType?: 'button' | 'reset' | 'submit';
  icon?: React.ReactNode;
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
  style?: React.CSSProperties;
  type?: 'primary' | 'link';
}

export const Button = ({
  children,
  type,
  htmlType,
  block,
  style,
  onClick,
  icon,
}: Props) => {
  return (
    <button
      type={htmlType ?? 'button'}
      className={`ui-button ${type || ''} ${block ? 'block' : ''}`}
      style={style}
      onClick={onClick}
    >
      {icon && (
        <div data-testid="ui-button-icon-element" className="ui-button-icon">
          {icon}
        </div>
      )}{' '}
      <div>{children}</div>
    </button>
  );
};
