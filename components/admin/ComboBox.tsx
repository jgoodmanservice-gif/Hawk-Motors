"use client";

import { useEffect, useRef, useState } from "react";

type Option = { id: string; name: string };

export function ComboBox({
  value,
  onChange,
  options,
  placeholder = "Search…",
  disabled = false,
}: {
  value: string;
  onChange: (id: string) => void;
  options: Option[];
  placeholder?: string;
  disabled?: boolean;
}) {
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const selected = options.find((o) => o.id === value);

  const filtered = query.trim()
    ? options.filter((o) => o.name.toLowerCase().startsWith(query.toLowerCase()))
    : options.slice(0, 50);

  useEffect(() => {
    function onClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  function select(opt: Option) {
    onChange(opt.id);
    setQuery("");
    setOpen(false);
  }

  function handleFocus() {
    if (!disabled) { setQuery(""); setOpen(true); }
  }

  function handleInput(e: React.ChangeEvent<HTMLInputElement>) {
    setQuery(e.target.value);
    setOpen(true);
    if (!e.target.value) onChange("");
  }

  return (
    <div ref={ref} className="relative">
      <input
        type="text"
        className="input"
        placeholder={disabled ? "Select make first" : placeholder}
        disabled={disabled}
        value={open ? query : (selected?.name ?? "")}
        onFocus={handleFocus}
        onChange={handleInput}
        autoComplete="off"
      />
      {open && filtered.length > 0 && (
        <ul className="absolute z-50 mt-1 max-h-56 w-full overflow-y-auto rounded-xl border border-white/10 bg-[rgb(var(--bg-elev))] shadow-xl">
          {filtered.map((opt) => (
            <li
              key={opt.id}
              onMouseDown={() => select(opt)}
              className="cursor-pointer px-4 py-2 text-sm hover:bg-white/10"
            >
              {opt.name}
            </li>
          ))}
        </ul>
      )}
      {open && query.trim() && filtered.length === 0 && (
        <div className="absolute z-50 mt-1 w-full rounded-xl border border-white/10 bg-[rgb(var(--bg-elev))] px-4 py-3 text-sm text-[rgb(var(--muted))] shadow-xl">
          No results for &ldquo;{query}&rdquo;
        </div>
      )}
    </div>
  );
}
