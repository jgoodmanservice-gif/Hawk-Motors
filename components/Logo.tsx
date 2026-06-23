export function Logo({
  className = "",
}: {
  variant?: "mark" | "full";
  className?: string;
  withText?: boolean;
}) {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img src="/logo.png" alt="Hawk Motors" className={className} />
  );
}
