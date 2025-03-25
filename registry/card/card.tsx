import { Button } from "../button/button.tsx";

interface CardProps {
  title?: string;
  content: string;
  buttonText?: string;
}

export function Card({
  title = "Card Title",
  content = "Card Content",
  buttonText = "CTA",
}: CardProps) {
  return (
    <div className="skin-secondary rounded-lg  p-4 shadow-sm">
      <div className="mb-4">
        <h2 className="text-xl font-semibold">{title}</h2>
        <p className="mt-2">{content}</p>
      </div>
      <div className="mt-4">
        <Button title={buttonText} />
      </div>
    </div>
  );
}
