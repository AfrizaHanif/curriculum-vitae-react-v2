import React from "react";

// Types
export interface SelectOption {
  label: string;
  value: string | number;
  disabled?: boolean;
}

// Props
export interface SelectProps {
  label?: string;
  size?: "sm" | "lg";
  name: string;
  id: string;
  placeholder?: string;
  value?: string | number | readonly string[];
  defaultValue?: string | number | readonly string[];
  options?: SelectOption[];
  multiple?: boolean;
  disabled?: boolean;
  helpText?: string;
  helpTextId?: string;
  required?: boolean;
  className?: string;
  style?: React.CSSProperties;
  children?: React.ReactNode;
  onChange?: (e: React.ChangeEvent<HTMLSelectElement>) => void;
}

export default function InputSelect({
  label,
  size,
  name,
  id,
  placeholder,
  value,
  defaultValue,
  options,
  multiple = false,
  disabled,
  helpText,
  helpTextId,
  required,
  className,
  style,
  children,
  onChange,
}: SelectProps) {
  return (
    <>
    {/* Label */}
      {label && (
        <label htmlFor={id} className="form-label">
          {label}
        </label>
      )}
      {/* Input Select */}
      <select
        name={name}
        id={id}
        multiple={multiple}
        className={[
          "form-select",
          size === "sm" && "form-select-sm",
          size === "lg" && "form-select-lg",
          className,
        ]
          .filter(Boolean)
          .join(" ")}
        value={value}
        defaultValue={defaultValue}
        disabled={disabled}
        required={required}
        style={style}
        onChange={onChange}
      >
        {/* Placeholder */}
        {placeholder && (
          <option value="" disabled hidden={required}>
            {placeholder}
          </option>
        )}
        {/* Options */}
        {options
          ? options.map((option) => (
              <option
                key={option.value}
                value={option.value}
                disabled={option.disabled}
              >
                {option.label}
              </option>
            ))
          : children}
      </select>
      {/* Help Text */}
      {helpText && (
        <div id={helpTextId} className="form-text">
          {helpText}
        </div>
      )}
    </>
  );
}
