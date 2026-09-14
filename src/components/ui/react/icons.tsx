import React from "react";

// Standard icon props extending SVG attributes to allow styling via className, width, height, etc.
export type IconProps = React.SVGProps<SVGSVGElement>;

export const ReactIcon = ({
  className,
  width = 24,
  height = 24,
  ...props
}: IconProps) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="-11.5 -10.23174 23 20.46348"
    width={width}
    height={height}
    className={className}
    {...props}
  >
    <circle cx="0" cy="0" r="2.05" fill="currentColor" />
    <g stroke="currentColor" strokeWidth="1" fill="none">
      <ellipse rx="11" ry="4.2" />
      <ellipse rx="11" ry="4.2" transform="rotate(60)" />
      <ellipse rx="11" ry="4.2" transform="rotate(120)" />
    </g>
  </svg>
);

export const NextJsIcon = ({
  className,
  width = 24,
  height = 24,
  ...props
}: IconProps) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    width={width}
    height={height}
    fill="currentColor"
    className={className}
    {...props}
  >
    <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.666 17.518l-6.852-8.847v8.847H9.288V6.482h1.59l6.788 8.76V6.482h1.526v11.036h-1.526z" />
  </svg>
);

export const TypeScriptIcon = ({
  className,
  width = 24,
  height = 24,
  ...props
}: IconProps) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    width={width}
    height={height}
    fill="currentColor"
    className={className}
    {...props}
  >
    <path d="M1.5 0h21l1.5 1.5v21l-1.5 1.5h-21L0 22.5v-21L1.5 0zm10.74 13.82c-.14-.7-.41-1.3-.82-1.78-.4-.48-.96-.86-1.67-1.13l-.98-.36c-.44-.16-.76-.35-.98-.56-.21-.21-.32-.47-.32-.78 0-.34.13-.62.39-.84.26-.22.62-.33 1.07-.33.43 0 .78.1 1.05.3.28.2.47.49.58.87l1.7-.68c-.24-.65-.63-1.18-1.19-1.58-.55-.4-1.28-.6-2.19-.6-.94 0-1.71.25-2.31.75-.59.5-.89 1.18-.89 2.05 0 .66.2 1.21.6 1.66.4.45.96.8 1.68 1.06l.99.36c.55.2.95.44 1.21.72.26.28.39.63.39 1.05 0 .42-.16.76-.48 1.02-.32.26-.77.39-1.34.39-.62 0-1.11-.15-1.48-.44-.36-.29-.6-.72-.72-1.28l-1.72.63c.27.94.75 1.67 1.45 2.19.7.52 1.59.78 2.68.78.99 0 1.83-.24 2.51-.73.68-.49 1.02-1.21 1.02-2.16 0-.38-.07-.73-.2-1.04zm9.32-6.57H16.2v10.45h2.15V9.45h3.21V7.25z" />
  </svg>
);

export const TailwindIcon = ({
  className,
  width = 24,
  height = 24,
  ...props
}: IconProps) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    width={width}
    height={height}
    fill="currentColor"
    className={className}
    {...props}
  >
    <path d="M12.001,4.8c-3.2,0-5.2,1.6-6,4.8c1.2-1.6,2.6-2.2,4.2-1.8c0.913,0.228,1.565,0.89,2.288,1.624 C13.666,10.618,15.027,12,18.001,12c3.2,0,5.2-1.6,6-4.8c-1.2,1.6-2.6,2.2-4.2,1.8c-0.913-0.228-1.565-0.89-2.288-1.624 C16.337,6.182,14.976,4.8,12.001,4.8z M6.001,12c-3.2,0-5.2,1.6-6,4.8c1.2-1.6,2.6-2.2,4.2-1.8c0.913,0.228,1.565,0.89,2.288,1.624 c1.177,1.194,2.538,2.576,5.512,2.576c3.2,0,5.2-1.6,6-4.8c-1.2,1.6-2.6,2.2-4.2,1.8c-0.913-0.228-1.565-0.89-2.288-1.624 C10.337,13.382,8.976,12,6.001,12z" />
  </svg>
);
