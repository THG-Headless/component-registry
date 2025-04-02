import React from 'react';

interface ButtonProps {
  children: React.ReactNode;
  className?: string;
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
}

export function Button({ children, className = "", onClick }: ButtonProps) {
  return <button onClick={onClick} className={`interactive btn ${className}`}>{children}</button>;
}