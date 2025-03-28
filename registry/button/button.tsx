interface ButtonProps {
  title?: string;
}

export function Button({ title = "button" }: ButtonProps) {
  return (
    <button className="skin-primary-emphasised interactive btn">{title}</button>
  );
}
