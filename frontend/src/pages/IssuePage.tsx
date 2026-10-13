import { useEffect, useState } from "react";
import type { FormEvent } from "react";
import { api } from "../services/api";
import type { Issue } from "../types";

export default function IssuePage() {
  const [issues, setIssues] = useState<Issue[]>([]);
  const [form, setForm] = useState({ title: "", description: "", category: "Campus" });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  async function fetchIssues() {
    try {
      const data = await api.getIssues();
      setIssues(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to load issues.");
    }
  }

  useEffect(() => {
    void fetchIssues();
  }, []);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    try {
      const issue = await api.createIssue(form.title, form.description, form.category);
      setIssues((current) => [issue, ...current]);
      setForm({ title: "", description: "", category: "Campus" });
      setSuccess("Your issue has been submitted successfully.");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to submit issue.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-[#f5f3ed] text-[#252722]">
      <section className="mx-auto max-w-[1440px] px-3 pt-4 sm:px-6 lg:px-10">
        <div
          className="relative flex min-h-[280px] items-center overflow-hidden bg-cover bg-center px-6 py-10 text-white sm:min-h-[340px] sm:px-12 lg:px-16"
          style={{ backgroundImage: "linear-gradient(90deg, rgba(25, 34, 28, .78), rgba(25, 34, 28, .28) 65%, rgba(25, 34, 28, .08)), url('https://images.unsplash.com/photo-1511632765486-a01980e01a18?auto=format&fit=crop&w=1800&q=85')" }}
        >
          <div className="max-w-2xl">
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/80">Community issues</p>
            <h1 className="mt-3 max-w-xl text-4xl font-extrabold leading-[1.05] tracking-[-0.055em] sm:text-5xl">Bring what matters to the table.</h1>
            <p className="mt-3 max-w-lg text-sm leading-6 text-white/85">Share a concern, follow what your neighbors raise, and help move the conversation forward.</p>
            <a href="#raise-issue" className="mt-5 inline-flex border-b border-white pb-1 text-xs font-bold text-white transition hover:text-[#f1d76c]">
              Submit a community issue <span className="ml-2">↓</span>
            </a>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-[1440px] px-4 py-8 sm:px-6 lg:px-10">
        <div className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:gap-16">
          <div id="raise-issue" className="scroll-mt-24">
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#87877b]">Start a conversation</p>
            <h2 className="mt-1 text-2xl font-extrabold tracking-[-0.04em] text-[#252722]">Raise an issue</h2>
            <p className="mt-2 text-sm leading-6 text-[#77766b]">Describe what needs attention so your community can respond.</p>

            <form onSubmit={handleSubmit} className="mt-6 space-y-4">
              <div>
                <label className="mb-1.5 block text-xs font-semibold text-[#53564e]" htmlFor="title">Issue title</label>
                <input
                  id="title"
                  value={form.title}
                  onChange={(event) => setForm({ ...form, title: event.target.value })}
                  className="w-full rounded-xl border border-[#e1ddd2] bg-[#fbfaf6] px-4 py-3 text-sm text-[#292c26] outline-none transition placeholder:text-[#aaa99f] focus:border-[#b5a65f] focus:ring-4 focus:ring-[#d6c36b]/20"
                  placeholder="What needs to change?"
                  required
                />
              </div>

              <div>
                <label className="mb-1.5 block text-xs font-semibold text-[#53564e]" htmlFor="category">Category</label>
                <select
                  id="category"
                  value={form.category}
                  onChange={(event) => setForm({ ...form, category: event.target.value })}
                  className="w-full rounded-xl border border-[#e1ddd2] bg-[#fbfaf6] px-4 py-3 text-sm text-[#292c26] outline-none transition focus:border-[#b5a65f] focus:ring-4 focus:ring-[#d6c36b]/20"
                >
                  <option value="Campus">Campus</option>
                  <option value="Events">Events</option>
                  <option value="Facilities">Facilities</option>
                  <option value="Safety">Safety</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div>
                <label className="mb-1.5 block text-xs font-semibold text-[#53564e]" htmlFor="description">Tell us more</label>
                <textarea
                  id="description"
                  value={form.description}
                  onChange={(event) => setForm({ ...form, description: event.target.value })}
                  className="min-h-32 w-full rounded-xl border border-[#e1ddd2] bg-[#fbfaf6] px-4 py-3 text-sm text-[#292c26] outline-none transition placeholder:text-[#aaa99f] focus:border-[#b5a65f] focus:ring-4 focus:ring-[#d6c36b]/20"
                  placeholder="Share the issue and how it affects the community."
                  required
                />
              </div>

              {error ? <div role="alert" className="border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">{error}</div> : null}
              {success ? <div role="status" className="border border-[#cbd4c4] bg-[#edf1e8] px-4 py-3 text-sm font-medium text-[#3d5944]">{success}</div> : null}

              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-xl bg-[#e8c84f] px-6 py-3.5 text-sm font-bold text-[#29291f] shadow-sm transition hover:bg-[#f0d66c] disabled:cursor-not-allowed disabled:opacity-70"
              >
                {loading ? "Submitting..." : "Submit issue"}
              </button>
            </form>
          </div>

          <div>
            <div className="flex items-end justify-between gap-4 border-b border-[#dfdcd2] pb-4">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#87877b]">What people are raising</p>
                <h2 className="mt-1 text-2xl font-extrabold tracking-[-0.04em] text-[#252722]">Recent issues</h2>
              </div>
              <span className="text-xs font-medium text-[#77766b]">{issues.length} submitted</span>
            </div>

            <div className="divide-y divide-[#e3e0d7]">
              {issues.length === 0 ? (
                <p className="py-8 text-sm text-[#77766b]">No issues have been submitted yet. Start the conversation by raising one.</p>
              ) : (
                issues.map((issue) => (
                  <article key={issue._id} className="py-5">
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <div>
                        <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-[#8a806f]">{issue.category}</p>
                        <h3 className="mt-1 text-lg font-bold leading-6 text-[#292b25]">{issue.title}</h3>
                      </div>
                      <span className="shrink-0 border border-[#d9d7ca] px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.1em] text-[#5d6b4c]">
                        {issue.status}
                      </span>
                    </div>
                    <p className="mt-2 text-sm leading-6 text-[#68695f]">{issue.description}</p>
                    <p className="mt-3 text-[10px] font-medium text-[#929087]">Raised {new Date(issue.createdAt).toLocaleDateString()}</p>
                  </article>
                ))
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
