import React from "react";

// Props
export interface TextareaProps {
  label?: string;
  size?: "sm" | "lg";
  name: string;
  id: string;
  placeholder?: string;
  value?: string;
  rows?: number;
  disabled?: boolean;
  helpText?: string;
  helpTextId?: string;
  required?: boolean;
  readOnly?: boolean;
  className?: string;
  style?: React.CSSProperties;
  onChange?: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
}

export default function InputText({
  label,
  size,
  name,
  id,
  placeholder,
  value,
  rows = 4,
  disabled,
  helpText,
  helpTextId,
  required,
  readOnly,
  className,
  style,
  onChange,
}: TextareaProps) {
  return (
    <>
      {/* Label */}
      {label && (
        <label htmlFor={id} className="form-label">
          {label}
        </label>
      )}
      {/* Input Textarea */}
      <textarea
        name={name}
        id={id}
        rows={rows}
        placeholder={placeholder}
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
      {/* Help Text */}
      {helpText && (
        <div id={helpTextId} className="form-text">
          {helpText}
        </div>
      )}
    </>
  );
}
