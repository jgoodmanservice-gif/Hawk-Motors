import React from "react";

// "full" = wings + HAWK MOTOR CENTRE wordmark (wide), "mark" = wings only.
export function Logo({
  variant = "full",
  className = "",
  style,
}: {
  variant?: "mark" | "full";
  className?: string;
  style?: React.CSSProperties;
}) {
  const src = variant === "mark" ? "/logo-mark.png" : "/logo.png";
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img src={src} alt="Hawk Motor Centre" className={className} style={style} />
  );
}
