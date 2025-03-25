interface ButtonProps {
  title?: string;
}

export function Button({ title = "hello world" }: ButtonProps) {
  return <button className="btn skin-error interactive">{title}</button>;
}
