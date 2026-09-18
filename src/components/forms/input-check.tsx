// Props
export interface InputCheckProps {
  type?: "checkbox" | "radio";
  label: string;
  name: string;
  id: string;
  value?: string;
  checked?: boolean;
  defaultChecked?: boolean;
  disabled?: boolean;
  required?: boolean;
  inline?: boolean;
  helpText?: string;
  helpTextId?: string;
  className?: string;
  style?: React.CSSProperties;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export default function InputCheck({
  type = "checkbox",
  label,
  name,
  id,
  value,
  checked,
  defaultChecked,
  disabled,
  required,
  inline = false,
  helpText,
  helpTextId,
  className,
  style,
  onChange,
}: InputCheckProps) {
  return (
    <div
      className={["form-check", inline && "form-check-inline", className]
        .filter(Boolean)
        .join(" ")}
      style={style}
    >
      {/* Input */}
      <input
        type={type}
        name={name}
        id={id}
        className="form-check-input"
        value={value}
        checked={checked}
        defaultChecked={defaultChecked}
        disabled={disabled}
        required={required}
        onChange={onChange}
      />
      {/* Label */}
      <label htmlFor={id} className="form-check-label">
        {label}
      </label>
      {/* Help Text */}
      {helpText && (
        <div id={helpTextId} className="form-text">
          {helpText}
        </div>
      )}
    </div>
  );
}
