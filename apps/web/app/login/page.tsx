"use client";

import { signIn } from "next-auth/react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { LogIn, Loader2 } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const result = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    setLoading(false);

    if (result?.error) {
      setError("Invalid email or password");
    } else {
      router.push("/map");
      router.refresh();
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="bg-neutral-900 border border-white/10 rounded-2xl p-8 shadow-2xl backdrop-blur-sm">
          <div className="text-center mb-8">
            <div className="w-12 h-12 rounded-xl bg-secondary flex items-center justify-center text-white font-bold text-xl mx-auto mb-4">
              S
            </div>
            <h1 className="text-2xl font-bold text-white">Welcome Back</h1>
            <p className="text-neutral-400 text-sm mt-1">
              Sign in to your SkateSpot account
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
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                required
                className="w-full bg-neutral-800 border border-white/10 rounded-lg px-3 py-2.5 text-white placeholder:text-neutral-500 focus:outline-none focus:border-secondary focus:ring-1 focus:ring-secondary/50"
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
                placeholder="Enter your password"
                required
                className="w-full bg-neutral-800 border border-white/10 rounded-lg px-3 py-2.5 text-white placeholder:text-neutral-500 focus:outline-none focus:border-secondary focus:ring-1 focus:ring-secondary/50"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-secondary hover:bg-secondary-dark disabled:opacity-50 text-white font-bold rounded-lg transition-colors flex items-center justify-center gap-2 shadow-lg shadow-secondary/20"
            >
              {loading ? (
                <Loader2 size={20} className="animate-spin" />
              ) : (
                <LogIn size={20} />
              )}
              {loading ? "Signing in..." : "Sign In"}
            </button>
          </form>

          <div className="mt-6 text-center text-sm text-neutral-400">
            Don&apos;t have an account?{" "}
            <Link
              href="/signup"
              className="text-secondary hover:text-secondary-light font-medium"
            >
              Sign Up
            </Link>
          </div>

          <div className="mt-4 p-3 rounded-lg bg-white/5 border border-white/10">
            <p className="text-xs text-neutral-500 text-center">
              Demo account: <span className="text-neutral-300">demo@skatespot.com</span> / <span className="text-neutral-300">password123</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
