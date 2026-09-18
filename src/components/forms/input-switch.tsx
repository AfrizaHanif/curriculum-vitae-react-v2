// Props
export interface InputSwitchProps {
  id: string;
  label: string;
  className?: string;
}

export default function InputSwitch({
  id,
  label,
  className,
}: InputSwitchProps) {
  return (
    <div className={`form-check form-switch ${className}`}>
      {/* Input */}
      <input
        className="form-check-input"
        type="checkbox"
        role="switch"
        id={id}
      />
      {/* Label */}
      <label className="form-check-label" htmlFor={id}>
        {label}
      </label>
    </div>
  );
}
