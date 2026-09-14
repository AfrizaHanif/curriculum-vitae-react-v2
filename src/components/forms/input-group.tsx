import Button from "../ui/bootstrap/button";

export interface InputGroupProps {
  id?: string;
  label?: string;
  position?: "start" | "end";
  size?: "sm" | "lg";
  type?: "text" | "button";
  inputText?: string;
  children: React.ReactNode;
}

export default function InputGroup({
  id,
  label,
  position,
  size,
  type,
  inputText,
  children,
}: InputGroupProps) {
  let additionalInput: React.ReactNode = "";

  if (type === "button") {
    additionalInput = (
      <Button color="secondary" size={size}>
        {inputText}
      </Button>
    );
  } else {
    additionalInput = (
      <span className="input-group-text" id={id}>
        {inputText}
      </span>
    );
  }

  return (
    <>
      {label && <label className="form-label">{label}</label>}
      <div
        className={[
          "input-group",
          size === "sm" && "input-group-sm",
          size === "lg" && "input-group-lg",
        ]
          .filter(Boolean)
          .join(" ")}
      >
        {position === "start" && additionalInput}
        {children}
        {position === "end" && additionalInput}
      </div>
    </>
  );
}
