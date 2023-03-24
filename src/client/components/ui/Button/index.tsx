import React from 'react';

interface Props {
  block?: boolean;
  children?: React.ReactNode;
  disabled?: boolean;
  htmlType?: 'button' | 'reset' | 'submit';
  icon?: React.ReactNode;
  style?: React.CSSProperties;
  type?: 'primary' | 'link';
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
}

export const Button = ({
  block,
  children,
  disabled,
  htmlType,
  icon,
  style,
  type,
  onClick,
}: Props) => {
  return (
    <button
      className={`ui-button ${type || ''} ${block ? 'block' : ''} ${
        disabled ? 'disabled' : ''
      }`}
      disabled={disabled}
      style={style}
      type={htmlType ?? 'button'}
      onClick={disabled ? undefined : onClick}
    >
      {icon && (
        <div data-testid="ui-button_icon-element" className="ui-button_icon">
          {icon}
        </div>
      )}{' '}
      <div>{children}</div>
    </button>
  );
};
