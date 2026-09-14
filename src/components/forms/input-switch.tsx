interface InputSwitchProps {
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
      <input
        className="form-check-input"
        type="checkbox"
        role="switch"
        id={id}
      />
      <label className="form-check-label" htmlFor={id}>
        {label}
      </label>
    </div>
  );
}
