export interface InputProps {
  type?:
    | "text"
    | "password"
    | "email"
    | "number"
    | "tel"
    | "url"
    | "search"
    | "date"
    | "time"
    | "datetime-local"
    | "month"
    | "week";
  label?: string;
  size?: "sm" | "lg";
  name: string;
  id: string;
  placeholder?: string;
  value?: string;
  disabled?: boolean;
  helpText?: string;
  helpTextId?: string;
  required?: boolean;
  readOnly?: boolean;
  className?: string;
  style?: React.CSSProperties;
  "aria-label"?: string;
  "aria-describedby"?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export default function Input({
  type = "text",
  label,
  size,
  name,
  id,
  placeholder,
  value,
  disabled,
  helpText,
  helpTextId,
  required,
  readOnly,
  className,
  style,
  "aria-label": ariaLabel,
  "aria-describedby": ariaDescribedBy,
  onChange,
}: InputProps) {
  return (
    <>
      {label && (
        <label htmlFor={id} className="form-label">
          {label}
        </label>
      )}
      <input
        type={type}
        name={name}
        id={id}
        placeholder={placeholder}
        aria-label={ariaLabel}
        aria-describedby={ariaDescribedBy || helpTextId}
        className={[
          "form-control",
          size === "sm" && "form-control-sm",
          size === "lg" && "form-control-lg",
          className,
        ]
          .filter(Boolean)
          .join(" ")}
        value={value}
        disabled={disabled}
        style={style}
        required={required}
        readOnly={readOnly}
        onChange={onChange}
      />
      {helpText && (
        <div id={helpTextId} className="form-text">
          {helpText}
        </div>
      )}
    </>
  );
}
