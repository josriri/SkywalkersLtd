import { useState, type FormEvent } from "react";
import { Lock, Loader2 } from "lucide-react";
import { Btn, Card } from "../components/ui";
import { api, ApiError } from "../lib/api";
import { useAuth } from "../lib/auth";

export function AdminLogin() {
  const { setToken } = useAuth();
  const [password, setPassword] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "error">("idle");
  const [error, setError] = useState("");

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setStatus("loading");
    setError("");
    try {
      const { token } = await api.login(password);
      setToken(token);
    } catch (err) {
      setStatus("error");
      setError(err instanceof ApiError ? err.message : "Could not sign in.");
    }
  }

  return (
    <div className="max-w-sm mx-auto px-5 pt-24 pb-24">
      <Card>
        <div className="w-11 h-11 rounded-xl flex items-center justify-center mb-5 bg-ink/10 dark:bg-white/10">
          <Lock size={20} className="text-ink dark:text-[#EDE9DD]" />
        </div>
        <h1 className="font-display text-2xl mb-1 text-ink dark:text-[#EDE9DD]">Admin sign in</h1>
        <p className="text-sm mb-6 text-[#6B6153] dark:text-[#9AA3B5]">
          Skywalkers Ltd consultations dashboard.
        </p>
        <form onSubmit={handleSubmit} className="space-y-3">
          <input
            type="password"
            aria-label="Admin password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoFocus
            className="w-full rounded-lg border border-line dark:border-line-dark bg-transparent px-4 py-2.5 text-sm text-ink dark:text-[#EDE9DD]"
          />
          {status === "error" && <p className="text-sm text-clay">{error}</p>}
          <Btn type="submit" disabled={status === "loading"} className="w-full">
            {status === "loading" ? (
              <>
                <Loader2 size={15} className="animate-spin" /> Signing in…
              </>
            ) : (
              "Sign in"
            )}
          </Btn>
        </form>
      </Card>
    </div>
  );
}
