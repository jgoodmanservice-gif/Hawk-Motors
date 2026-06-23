"use client";

import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { Logo } from "@/components/Logo";
import { LogIn } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const sp = useSearchParams();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    const res = await signIn("credentials", { email, password, redirect: false });
    setLoading(false);
    if (res?.error) {
      setError("Invalid email or password.");
      return;
    }
    router.push(sp.get("callbackUrl") || "/admin");
    router.refresh();
  }

  return (
    <div className="grid min-h-screen place-items-center px-4">
      <div className="glass w-full max-w-sm p-8">
        <div className="mb-6 flex flex-col items-center">
          <Logo variant="full" className="h-24 w-44" />
          <p className="mt-1 text-sm text-[rgb(var(--muted))]">Admin sign in</p>
        </div>
        <form onSubmit={submit} className="space-y-3">
          <div>
            <label className="label">Email</label>
            <input type="email" required className="input" value={email} onChange={(e) => setEmail(e.target.value)} autoFocus />
          </div>
          <div>
            <label className="label">Password</label>
            <input type="password" required className="input" value={password} onChange={(e) => setPassword(e.target.value)} />
          </div>
          {error && <p className="text-sm text-rose-400">{error}</p>}
          <button disabled={loading} className="btn-accent w-full"><LogIn size={16} /> {loading ? "Signing in…" : "Sign in"}</button>
        </form>
      </div>
    </div>
  );
}
