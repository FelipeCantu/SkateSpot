"use client";

import { signIn } from "next-auth/react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { UserPlus, Loader2 } from "lucide-react";

export default function SignupPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, username, email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error);
        setLoading(false);
        return;
      }

      // Auto sign in after signup
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      setLoading(false);

      if (result?.error) {
        setError("Account created but sign-in failed. Please try logging in.");
      } else {
        router.push("/map");
        router.refresh();
      }
    } catch {
      setError("Something went wrong. Please try again.");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="bg-neutral-900 border border-white/10 rounded-2xl p-8 shadow-2xl backdrop-blur-sm">
          <div className="text-center mb-8">
            <div className="w-12 h-12 rounded-xl bg-accent flex items-center justify-center text-white font-bold text-xl mx-auto mb-4">
              S
            </div>
            <h1 className="text-2xl font-bold text-white">Join SkateSpot</h1>
            <p className="text-neutral-400 text-sm mt-1">
              Create your account and start skating
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 text-sm">
                {error}
              </div>
            )}

            <div className="space-y-1.5">
              <label className="text-sm font-medium text-neutral-300">
                Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Your full name"
                required
                className="w-full bg-neutral-800 border border-white/10 rounded-lg px-3 py-2.5 text-white placeholder:text-neutral-500 focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent/50"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-medium text-neutral-300">
                Username
              </label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="skater_name"
                required
                className="w-full bg-neutral-800 border border-white/10 rounded-lg px-3 py-2.5 text-white placeholder:text-neutral-500 focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent/50"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-medium text-neutral-300">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                required
                className="w-full bg-neutral-800 border border-white/10 rounded-lg px-3 py-2.5 text-white placeholder:text-neutral-500 focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent/50"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-medium text-neutral-300">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="At least 6 characters"
                required
                minLength={6}
                className="w-full bg-neutral-800 border border-white/10 rounded-lg px-3 py-2.5 text-white placeholder:text-neutral-500 focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent/50"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-accent hover:bg-accent-dark disabled:opacity-50 text-white font-bold rounded-lg transition-colors flex items-center justify-center gap-2 shadow-lg shadow-accent/20"
            >
              {loading ? (
                <Loader2 size={20} className="animate-spin" />
              ) : (
                <UserPlus size={20} />
              )}
              {loading ? "Creating account..." : "Create Account"}
            </button>
          </form>

          <div className="mt-6 text-center text-sm text-neutral-400">
            Already have an account?{" "}
            <Link
              href="/login"
              className="text-accent hover:text-accent-light font-medium"
            >
              Sign In
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
