import { useState } from "react";
import type { FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { api } from "../services/api";

export default function RegisterPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", email: "", password: "", confirmPassword: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");

    if (form.password !== form.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);

    try {
      const data = await api.register(form.name, form.email, form.password);
      localStorage.setItem("votesphere_token", data.token);
      localStorage.setItem("votesphere_user", JSON.stringify(data.user));
      navigate("/polls");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Registration failed.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="grid min-h-[calc(100vh-65px)] bg-[#f3f0e5] lg:grid-cols-[0.9fr_1.1fr]">
      <section className="flex items-center justify-center px-5 py-8 sm:px-10 lg:px-14 xl:px-20">
        <div className="w-full max-w-md">
          <div className="mb-7 flex items-center justify-between">
            <Link to="/" className="text-lg font-extrabold tracking-[-0.05em] text-[#30352d]">VoteSphere</Link>
            <Link to="/" className="rounded-full border border-[#d7d3c7] px-4 py-2 text-xs font-semibold text-[#64665e] transition hover:bg-white/60">Cancel</Link>
          </div>

          <div className="mb-5">
            <p className="text-xs font-semibold text-[#77766b]">Join the conversation</p>
            <h1 className="mt-2 text-3xl font-bold tracking-[-0.05em] text-[#292c26]">Create an account</h1>
            <p className="mt-2 text-sm text-[#77766b]">Make your voice part of the decisions that matter.</p>
          </div>

          <form className="space-y-3.5" onSubmit={handleSubmit}>
            <div>
              <label className="mb-1.5 block text-xs font-semibold text-[#53564e]" htmlFor="name">Full name</label>
              <input
                id="name"
                type="text"
                value={form.name}
                onChange={(event) => setForm({ ...form, name: event.target.value })}
                className="w-full rounded-xl border border-[#e6e2d7] bg-[#fbfaf6] px-4 py-3 text-sm text-[#292c26] outline-none transition placeholder:text-[#aaa99f] focus:border-[#b5a65f] focus:ring-4 focus:ring-[#d6c36b]/20"
                placeholder="Your name"
                autoComplete="name"
                required
              />
            </div>

            <div>
              <label className="mb-1.5 block text-xs font-semibold text-[#53564e]" htmlFor="email">Email address</label>
              <input
                id="email"
                type="email"
                value={form.email}
                onChange={(event) => setForm({ ...form, email: event.target.value })}
                className="w-full rounded-xl border border-[#e6e2d7] bg-[#fbfaf6] px-4 py-3 text-sm text-[#292c26] outline-none transition placeholder:text-[#aaa99f] focus:border-[#b5a65f] focus:ring-4 focus:ring-[#d6c36b]/20"
                placeholder="name@example.com"
                autoComplete="email"
                required
              />
            </div>

            <div>
              <label className="mb-1.5 block text-xs font-semibold text-[#53564e]" htmlFor="password">Password</label>
              <input
                id="password"
                type="password"
                value={form.password}
                onChange={(event) => setForm({ ...form, password: event.target.value })}
                className="w-full rounded-xl border border-[#e6e2d7] bg-[#fbfaf6] px-4 py-3 text-sm text-[#292c26] outline-none transition placeholder:text-[#aaa99f] focus:border-[#b5a65f] focus:ring-4 focus:ring-[#d6c36b]/20"
                placeholder="At least 6 characters"
                autoComplete="new-password"
                minLength={6}
                required
              />
            </div>

            <div>
              <label className="mb-1.5 block text-xs font-semibold text-[#53564e]" htmlFor="confirmPassword">Confirm password</label>
              <input
                id="confirmPassword"
                type="password"
                value={form.confirmPassword}
                onChange={(event) => setForm({ ...form, confirmPassword: event.target.value })}
                className="w-full rounded-xl border border-[#e6e2d7] bg-[#fbfaf6] px-4 py-3 text-sm text-[#292c26] outline-none transition placeholder:text-[#aaa99f] focus:border-[#b5a65f] focus:ring-4 focus:ring-[#d6c36b]/20"
                placeholder="Enter your password again"
                autoComplete="new-password"
                minLength={6}
                required
              />
            </div>

            {error ? (
              <div role="alert" className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">{error}</div>
            ) : null}

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-xl bg-[#e8c84f] px-6 py-3.5 text-sm font-bold text-[#29291f] shadow-sm transition hover:bg-[#f0d66c] disabled:cursor-not-allowed disabled:opacity-70"
            >
              {loading ? "Creating account..." : "Create account"}
            </button>
          </form>

          <p className="mt-5 text-center text-xs text-[#77766b]">
            Already have an account?{" "}
            <Link to="/login" className="font-bold text-[#30352d] underline decoration-[#c7ad38] underline-offset-4 hover:text-[#77702f]">Log in</Link>
          </p>
        </div>
      </section>

      <aside className="relative min-h-[260px] overflow-hidden lg:min-h-0">
        <img
          src="https://images.unsplash.com/photo-1521737711867-e3b97375f902?auto=format&fit=crop&w=1800&q=85"
          alt="Community members sharing ideas around a table"
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#222b24]/50 via-transparent to-[#222b24]/10" />
        <div className="absolute left-5 top-5 max-w-[230px] border border-white/45 bg-[#f6e28a]/95 px-4 py-3 text-[#363326] shadow-lg sm:left-8 sm:top-8">
          <p className="text-[10px] font-bold uppercase tracking-[0.16em]">Join your community</p>
          <p className="mt-1 text-xs">One account. A say in what happens next.</p>
        </div>
        <div className="absolute bottom-6 left-5 right-5 text-white sm:bottom-10 sm:left-8 sm:right-8 lg:bottom-12 lg:left-12">
          <p className="max-w-lg text-2xl font-bold leading-tight tracking-[-0.04em] drop-shadow sm:text-3xl">The best decisions start with everyone in the room.</p>
          <p className="mt-2 text-xs font-medium text-white/85">Create your account and make your voice count.</p>
        </div>
      </aside>
    </div>
  );
}
