import { useState } from "react";
import type { FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { api } from "../services/api";

const today = new Date();
today.setMinutes(today.getMinutes() - today.getTimezoneOffset());
const minimumDate = today.toISOString().slice(0, 10);

export default function CreatePollPage() {
  const navigate = useNavigate();
  const [question, setQuestion] = useState("");
  const [category, setCategory] = useState("Campus");
  const [closesAt, setClosesAt] = useState("");
  const [options, setOptions] = useState(["", ""]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  function updateOption(index: number, value: string) {
    setOptions((current) => current.map((option, optionIndex) => optionIndex === index ? value : option));
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");

    const cleanOptions = options.map((option) => option.trim());
    if (cleanOptions.some((option) => !option)) {
      setError("Add text for each option before publishing.");
      return;
    }
    if (new Set(cleanOptions.map((option) => option.toLowerCase())).size !== cleanOptions.length) {
      setError("Each poll option must be different.");
      return;
    }

    setLoading(true);
    try {
      const poll = await api.createPoll(question.trim(), cleanOptions, category, closesAt);
      navigate(`/polls/${poll._id}/results`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to create poll.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-[#f5f3ed] text-[#252722]">
      <section className="mx-auto max-w-[1440px] px-3 pt-4 sm:px-6 lg:px-10">
        <div
          className="relative flex min-h-[250px] items-center overflow-hidden bg-cover bg-center px-6 py-10 text-white sm:min-h-[300px] sm:px-12 lg:px-16"
          style={{ backgroundImage: "linear-gradient(90deg, rgba(25, 34, 28, .78), rgba(25, 34, 28, .28) 65%, rgba(25, 34, 28, .08)), url('https://images.unsplash.com/photo-1523580494863-6f3031224c94?auto=format&fit=crop&w=1800&q=85')" }}
        >
          <div className="max-w-2xl">
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/80">Start a conversation</p>
            <h1 className="mt-3 max-w-xl text-4xl font-extrabold leading-[1.05] tracking-[-0.055em] sm:text-5xl">Ask your community.</h1>
            <p className="mt-3 max-w-lg text-sm leading-6 text-white/85">Create a clear question, offer thoughtful choices, and invite people to take part.</p>
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-[1100px] gap-10 px-4 py-10 sm:px-6 lg:grid-cols-[1fr_0.7fr] lg:gap-16 lg:px-10">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#87877b]">New community poll</p>
            <label htmlFor="question" className="mb-2 mt-2 block text-xl font-bold tracking-[-0.03em] text-[#292b25]">What would you like to ask?</label>
            <textarea
              id="question"
              value={question}
              onChange={(event) => setQuestion(event.target.value)}
              maxLength={200}
              required
              className="min-h-28 w-full rounded-xl border border-[#e1ddd2] bg-[#fbfaf6] px-4 py-3 text-base text-[#292c26] outline-none transition placeholder:text-[#aaa99f] focus:border-[#b5a65f] focus:ring-4 focus:ring-[#d6c36b]/20"
              placeholder="For example: Which campus improvement should we prioritize?"
            />
            <p className="mt-1 text-right text-[10px] text-[#929087]">{question.length}/200</p>
          </div>

          <div>
            <div className="mb-3 flex items-center justify-between gap-3">
              <h2 className="text-sm font-bold text-[#45483f]">Answer options</h2>
              <span className="text-[10px] text-[#929087]">2 to 6 options</span>
            </div>
            <div className="space-y-3">
              {options.map((option, index) => (
                <div key={index} className="flex items-center gap-3">
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#e9e5d9] text-xs font-bold text-[#697352]">{String(index + 1).padStart(2, "0")}</span>
                  <input
                    value={option}
                    onChange={(event) => updateOption(index, event.target.value)}
                    maxLength={100}
                    aria-label={`Option ${index + 1}`}
                    className="min-w-0 flex-1 rounded-xl border border-[#e1ddd2] bg-[#fbfaf6] px-4 py-3 text-sm text-[#292c26] outline-none transition placeholder:text-[#aaa99f] focus:border-[#b5a65f] focus:ring-4 focus:ring-[#d6c36b]/20"
                    placeholder={`Option ${index + 1}`}
                    required
                  />
                  {options.length > 2 ? (
                    <button
                      type="button"
                      onClick={() => setOptions((current) => current.filter((_, optionIndex) => optionIndex !== index))}
                      className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-lg text-[#77766b] transition hover:bg-[#e9e5d9] hover:text-[#292c26]"
                      aria-label={`Remove option ${index + 1}`}
                    >
                      ×
                    </button>
                  ) : null}
                </div>
              ))}
            </div>
            {options.length < 6 ? (
              <button
                type="button"
                onClick={() => setOptions((current) => [...current, ""])}
                className="mt-3 text-xs font-bold text-[#536748] underline decoration-[#b8bd9f] underline-offset-4 hover:text-[#8b7048]"
              >
                + Add another option
              </button>
            ) : null}
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor="category" className="mb-1.5 block text-xs font-semibold text-[#53564e]">Category</label>
              <select
                id="category"
                value={category}
                onChange={(event) => setCategory(event.target.value)}
                className="w-full rounded-xl border border-[#e1ddd2] bg-[#fbfaf6] px-4 py-3 text-sm text-[#292c26] outline-none transition focus:border-[#b5a65f] focus:ring-4 focus:ring-[#d6c36b]/20"
              >
                <option>Campus</option>
                <option>Events</option>
                <option>Facilities</option>
                <option>Safety</option>
                <option>Wellbeing</option>
                <option>Other</option>
              </select>
            </div>
            <div>
              <label htmlFor="closesAt" className="mb-1.5 block text-xs font-semibold text-[#53564e]">Closing date <span className="font-normal text-[#929087]">(optional)</span></label>
              <input
                id="closesAt"
                type="date"
                min={minimumDate}
                value={closesAt}
                onChange={(event) => setClosesAt(event.target.value)}
                className="w-full rounded-xl border border-[#e1ddd2] bg-[#fbfaf6] px-4 py-3 text-sm text-[#292c26] outline-none transition focus:border-[#b5a65f] focus:ring-4 focus:ring-[#d6c36b]/20"
              />
            </div>
          </div>

          {error ? <div role="alert" className="border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">{error}</div> : null}

          <div className="flex flex-col-reverse gap-3 sm:flex-row sm:items-center sm:justify-between">
            <Link to="/polls" className="py-2 text-center text-xs font-bold text-[#6d7067] transition hover:text-[#292c26]">Cancel</Link>
            <button
              type="submit"
              disabled={loading}
              className="rounded-xl bg-[#e8c84f] px-7 py-3.5 text-sm font-bold text-[#29291f] shadow-sm transition hover:bg-[#f0d66c] disabled:cursor-not-allowed disabled:opacity-70"
            >
              {loading ? "Publishing..." : "Publish poll"}
            </button>
          </div>
        </form>

        <aside className="border-t border-[#dfdcd2] pt-6 lg:border-l lg:border-t-0 lg:pl-8 lg:pt-0">
          <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#87877b]">A thoughtful poll</p>
          <h2 className="mt-2 text-xl font-bold leading-7 text-[#292b25]">Make it easy for everyone to take part.</h2>
          <ul className="mt-5 space-y-4 text-sm leading-6 text-[#68695f]">
            <li className="flex gap-3"><span className="font-bold text-[#9b8b46]">01</span><span>Keep the question focused on one decision.</span></li>
            <li className="flex gap-3"><span className="font-bold text-[#9b8b46]">02</span><span>Use short, neutral options that are easy to compare.</span></li>
            <li className="flex gap-3"><span className="font-bold text-[#9b8b46]">03</span><span>Choose a closing date if the poll should end at a set time.</span></li>
          </ul>
          <Link to="/polls" className="mt-8 inline-flex border-b border-[#b8bd9f] pb-1 text-xs font-bold text-[#536748] hover:text-[#8b7048]">Browse current polls <span className="ml-2">→</span></Link>
        </aside>
      </section>
    </div>
  );
}
