import type React from "react";
import { cn } from "@/lib/utils";

export interface CursorProps extends React.ComponentProps<"span"> {
  /**
   * The collaborator's colour, any CSS colour: the pointer and the body's
   * fill. The body's text turns dark or light to stay readable on it.
   *
   * @default "var(--primary)"
   */
  color?: string;
}

/**
 * Where another person is on the page: a pointer and a label beside it.
 * It doesn't follow your mouse; place it where theirs is (`absolute` with
 * `left`/`top`, or `start-*`/`top-*`). The pointer's tip is the top-start
 * corner, and in right-to-left text the whole cursor mirrors.
 *
 * @cssvar --cursor-color The pointer's and the body's colour (`var(--primary)`).
 */
export const Cursor = (props: CursorProps) => {
  const { className, color, style, ...rest } = props;

  return (
    <span
      className={cn(
        "pointer-events-none relative inline-flex select-none flex-col items-start",
        className
      )}
      data-slot="cursor"
      style={{ "--cursor-color": color, ...style } as React.CSSProperties}
      {...rest}
    />
  );
};

export const CursorPointer = (props: React.ComponentProps<"svg">) => {
  const { className, ...rest } = props;

  return (
    <svg
      aria-hidden="true"
      className={cn(
        "size-3.5 shrink-0 text-(--cursor-color,var(--primary))",
        "rtl:-scale-x-100",
        className
      )}
      data-slot="cursor-pointer"
      fill="none"
      height="20"
      viewBox="0 0 20 20"
      width="20"
      {...rest}
    >
      <path
        d="M19.438 6.716 1.115.05A.832.832 0 0 0 .05 1.116L6.712 19.45a.834.834 0 0 0 1.557.025l3.198-8 7.995-3.2a.833.833 0 0 0 0-1.559h-.024Z"
        fill="currentColor"
      />
    </svg>
  );
};

export const CursorBody = (props: React.ComponentProps<"span">) => {
  const { className, ...rest } = props;

  return (
    <span
      className={cn(
        "relative ms-3.5 flex flex-col",
        "whitespace-nowrap rounded-xl py-1 ps-2.5 pe-3 text-xs",
        "bg-(--cursor-color,var(--primary))",
        // Dark text on a light colour, light text on a dark one.
        "text-[oklch(from_var(--cursor-color,var(--primary))_calc((0.65_-_l)_*_100)_0_0)]",
        "shadow-sm",
        // With a message, the corner by the pointer tightens and the name steps back.
        "has-data-[slot=cursor-message]:rounded-ss-sm",
        "has-data-[slot=cursor-message]:*:data-[slot=cursor-name]:opacity-70",
        className
      )}
      data-slot="cursor-body"
      {...rest}
    />
  );
};

export const CursorName = (props: React.ComponentProps<"span">) => {
  const { className, ...rest } = props;

  return (
    <span
      className={cn("font-medium [unicode-bidi:plaintext]", className)}
      data-slot="cursor-name"
      {...rest}
    />
  );
};

export const CursorMessage = (props: React.ComponentProps<"span">) => {
  const { className, ...rest } = props;

  return (
    <span
      className={cn("[unicode-bidi:plaintext]", className)}
      data-slot="cursor-message"
      {...rest}
    />
  );
};
