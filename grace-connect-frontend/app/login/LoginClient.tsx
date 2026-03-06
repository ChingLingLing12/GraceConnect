"use client";

import { useState, useMemo } from "react";
import { useRouter, useSearchParams } from "next/navigation";

export default function LoginClient() {
  const searchParams = useSearchParams();
  const router = useRouter();

  // Validate ministry safely
  const ministry = useMemo(() => {
    const m = searchParams.get("ministry");
    return m === "youth" || m === "sundayschool" ? m : null;
  }, [searchParams]);

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/auth/login`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include", // important if backend uses cookies
          body: JSON.stringify({ username, password }),
        }
      );

      const text = await res.text();

      let data;
      try {
        data = JSON.parse(text);
      } catch {
        throw new Error("Backend not responding correctly.");
      }

      if (!res.ok) {
        throw new Error(data?.error || "Login failed");
      }

      // Store token safely
      if (data?.token) {
        localStorage.setItem("token", data.token);
      }

      // Redirect safely
      if (ministry) {
        router.push(`/?ministry=${ministry}`);
      } else {
        router.push("/");
      }

    } catch (err: any) {
      setError(err.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0f172a] text-white">
      <form
        onSubmit={handleLogin}
        className="w-[350px] bg-[#1e293b] p-8 rounded-2xl shadow-xl"
      >
        <h2 className="text-2xl font-semibold mb-6 text-center">
          Admin Login
        </h2>

        {error && (
          <p className="bg-red-500/20 text-red-400 p-2 rounded mb-4 text-sm">
            {error}
          </p>
        )}

        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
          className="w-full mb-4 p-3 rounded-lg bg-[#0f172a] border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        <div className="relative mb-4">
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full p-3 rounded-lg bg-[#0f172a] border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-3 text-sm text-gray-400 hover:text-white"
          >
            {showPassword ? "Hide" : "Show"}
          </button>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full p-3 rounded-lg bg-blue-600 hover:bg-blue-700 transition disabled:opacity-50"
        >
          {loading ? "Logging in..." : "Login"}
        </button>
      </form>
    </div>
  );
}