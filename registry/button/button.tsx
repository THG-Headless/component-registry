interface ButtonProps {
  children: React.ReactNode;
  className?: string;
}

export function Button({ children, className }: ButtonProps) {
  return <button className={`interactive btn ${className}`}>{children}</button>;
}
