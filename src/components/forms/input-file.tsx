export interface InputFileProps {
  label?: string;
  size?: "sm" | "lg";
  name: string;
  id: string;
  accept?: string;
  multiple?: boolean;
  disabled?: boolean;
  required?: boolean;
  helpText?: string;
  helpTextId?: string;
  className?: string;
  style?: React.CSSProperties;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export default function InputFile({
  label,
  size,
  name,
  id,
  accept,
  multiple,
  disabled,
  required,
  helpText,
  helpTextId,
  className,
  style,
  onChange,
}: InputFileProps) {
  return (
    <>
      {label && (
        <label htmlFor={id} className="form-label">
          {label}
        </label>
      )}
      <input
        type="file"
        name={name}
        id={id}
        accept={accept}
        multiple={multiple}
        className={[
          "form-control",
          size === "sm" && "form-control-sm",
          size === "lg" && "form-control-lg",
          className,
        ]
          .filter(Boolean)
          .join(" ")}
        disabled={disabled}
        style={style}
        required={required}
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
