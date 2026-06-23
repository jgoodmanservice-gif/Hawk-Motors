import React from "react";

export function Logo({
  className = "",
  style,
}: {
  variant?: "mark" | "full";
  className?: string;
  withText?: boolean;
  style?: React.CSSProperties;
}) {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img src="/logo.png" alt="Hawk Motors" className={className} style={style} />
  );
}
