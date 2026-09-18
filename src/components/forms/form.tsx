// Props
export interface FormProps extends React.FormHTMLAttributes<HTMLFormElement> {
  className?: string;
  action?: string;
  method?: "GET" | "POST" | "PUT" | "DELETE" | "PATCH" | "HEAD" | "OPTIONS";
  children: React.ReactNode;
  onSubmit?: (e: React.FormEvent<HTMLFormElement>) => void;
}

export default function Form({
  className,
  action,
  method = "POST",
  children,
  onSubmit,
  ...rest
}: FormProps) {
  return (
    <form
      className={className}
      action={action}
      method={method}
      onSubmit={onSubmit}
      {...rest}
    >
      {children}
    </form>
  );
}
