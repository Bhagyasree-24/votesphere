import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { api } from "../services/api";
import type { Poll, PollResults } from "../types";

export default function PollsPage() {
  const [polls, setPolls] = useState<Poll[]>([]);
  const [results, setResults] = useState<Record<string, PollResults>>({});
  const [voterId, setVoterId] = useState(() => localStorage.getItem("votesphere_voter_id") || "");
  const [selectedOptions, setSelectedOptions] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [status, setStatus] = useState<{ type: "success" | "error"; text: string } | null>(null);

  async function loadPolls() {
    try {
      const nextPolls = await api.getPolls();
      setPolls(nextPolls);

      const pollResults = await Promise.all(
        nextPolls.map(async (poll) => ({ pollId: poll._id, data: await api.getResults(poll._id) }))
      );

      const nextMap = Object.fromEntries(
        pollResults.map(({ pollId, data }) => [pollId, data])
      ) as Record<string, PollResults>;

      setResults(nextMap);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to load polls.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void loadPolls();
  }, []);

  async function handleVote(pollId: string) {
    const optionId = selectedOptions[pollId];

    if (!optionId) {
      setStatus({ type: "error", text: "Please select an option before voting." });
      return;
    }

    const nextVoterId = voterId.trim() || `voter-${Date.now()}`;
    localStorage.setItem("votesphere_voter_id", nextVoterId);
    setVoterId(nextVoterId);

    try {
      await api.vote(pollId, optionId, nextVoterId);
      const nextResults = await api.getResults(pollId);
      setResults((current) => ({ ...current, [pollId]: nextResults }));
      setStatus({ type: "success", text: "Your vote has been recorded." });
    } catch (err) {
      setStatus({
        type: "error",
        text: err instanceof Error ? err.message : "Unable to cast vote."
      });
    }
  }

  return (
    <div className="min-h-screen bg-[#f5f3ed] text-[#252722]">
      <section className="mx-auto max-w-[1440px] px-3 pt-4 sm:px-6 lg:px-10">
        <div
          className="relative flex min-h-[280px] items-center overflow-hidden bg-cover bg-center px-6 py-10 text-white sm:min-h-[340px] sm:px-12 lg:px-16"
          style={{ backgroundImage: "linear-gradient(90deg, rgba(25, 34, 28, .78), rgba(25, 34, 28, .28) 65%, rgba(25, 34, 28, .08)), url('https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=1800&q=85')" }}
        >
          <div className="max-w-2xl">
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/80">Community polls</p>
            <h1 className="mt-3 max-w-xl text-4xl font-extrabold leading-[1.05] tracking-[-0.055em] sm:text-5xl">Shape what happens next.</h1>
            <p className="mt-3 max-w-lg text-sm leading-6 text-white/85">Explore the questions your community is answering and add your perspective.</p>
            <div className="mt-5 flex flex-wrap gap-x-6 gap-y-3">
              <Link to="/polls/create" className="inline-flex border-b border-white pb-1 text-xs font-bold text-white transition hover:text-[#f1d76c]">
                Start a new poll <span className="ml-2">→</span>
              </Link>
              <Link to="/issues" className="inline-flex border-b border-white/60 pb-1 text-xs font-bold text-white transition hover:text-[#f1d76c]">
                Raise an issue <span className="ml-2">→</span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-[1440px] px-4 py-8 sm:px-6 lg:px-10">
        <div className="flex flex-col gap-4 border-b border-[#dfdcd2] pb-6 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#87877b]">Make it count</p>
            <h2 className="mt-1 text-2xl font-extrabold tracking-[-0.04em] text-[#252722] sm:text-3xl">Open for your vote</h2>
          </div>
          <label className="w-full sm:max-w-xs">
            <span className="mb-1.5 block text-[11px] font-semibold text-[#68695f]">Voter ID</span>
            <input
              value={voterId}
              onChange={(event) => setVoterId(event.target.value)}
              className="w-full rounded-xl border border-[#e1ddd2] bg-[#fbfaf6] px-4 py-3 text-sm text-[#292c26] outline-none transition placeholder:text-[#aaa99f] focus:border-[#b5a65f] focus:ring-4 focus:ring-[#d6c36b]/20"
              placeholder="Enter your voter ID"
            />
          </label>
        </div>

        {error ? <div role="alert" className="mt-5 border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">{error}</div> : null}
        {status ? (
          <div role="status" className={`mt-5 border px-4 py-3 text-sm font-medium ${status.type === "success" ? "border-[#cbd4c4] bg-[#edf1e8] text-[#3d5944]" : "border-red-200 bg-red-50 text-red-700"}`}>
            {status.text}
          </div>
        ) : null}

        {loading ? (
          <p className="py-16 text-center text-sm font-semibold text-[#77766b]">Loading polls...</p>
        ) : polls.length === 0 ? (
          <div className="py-16 text-center">
            <p className="text-lg font-bold text-[#363830]">No polls are open yet.</p>
            <p className="mt-2 text-sm text-[#77766b]">Check back soon to take part in your community's next decision.</p>
          </div>
        ) : (
          <div className="grid gap-x-7 gap-y-8 py-7 lg:grid-cols-2">
            {polls.map((poll, index) => {
              const result = results[poll._id];
              const pollClosed = poll.closesAt ? new Date(poll.closesAt).getTime() <= Date.now() : false;
              const images = [
                "photo-1523580494863-6f3031224c94",
                "photo-1511632765486-a01980e01a18",
                "photo-1497366754035-f200968a6e72",
                "photo-1521737711867-e3b97375f902"
              ];

              return (
                <article key={poll._id} className="grid overflow-hidden border border-[#e4e0d6] bg-[#fbfaf6] sm:grid-cols-[0.7fr_1.3fr]">
                  <img
                    src={`https://images.unsplash.com/${images[index % images.length]}?auto=format&fit=crop&w=700&q=80`}
                    alt=""
                    className="aspect-[1.7] h-full w-full object-cover sm:aspect-auto"
                    loading="lazy"
                  />
                  <div className="p-4 sm:p-5">
                    <div className="flex items-center justify-between gap-3">
                      <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-[#8a806f]">{poll.category || "Community question"}</p>
                      {result ? <span className="shrink-0 text-[10px] font-semibold text-[#77766b]">{result.totalVotes} votes</span> : null}
                    </div>
                    <h3 className="mt-2 text-lg font-bold leading-6 text-[#292b25]">{poll.question}</h3>

                    <div className="mt-4 space-y-2">
                      {poll.options.map((option) => {
                        const percentage = result?.options.find((item) => item.id === option._id)?.percentage ?? 0;

                        return (
                          <label key={option._id} className="flex cursor-pointer items-center justify-between gap-3 border-b border-[#e8e5dc] py-2 text-sm transition hover:text-[#536748]">
                            <span className="flex min-w-0 items-center gap-2.5">
                              <input
                                type="radio"
                                name={poll._id}
                                checked={selectedOptions[poll._id] === option._id}
                                disabled={pollClosed}
                                onChange={() => setSelectedOptions((current) => ({ ...current, [poll._id]: option._id }))}
                                className="h-4 w-4 shrink-0 accent-[#697b51] disabled:cursor-not-allowed"
                              />
                              <span className="truncate font-medium">{option.text}</span>
                            </span>
                            {result ? <span className="shrink-0 text-xs font-semibold text-[#77766b]">{percentage}%</span> : null}
                          </label>
                        );
                      })}
                    </div>

                    <div className="mt-4 flex items-center justify-between gap-3">
                      <button
                        type="button"
                        onClick={() => void handleVote(poll._id)}
                        disabled={pollClosed}
                        className="rounded-md bg-[#e8c84f] px-4 py-2.5 text-xs font-bold text-[#29291f] transition hover:bg-[#f0d66c] disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        {pollClosed ? "Poll closed" : "Cast vote"}
                      </button>
                      <Link to={`/polls/${poll._id}/results`} className="text-[10px] font-bold text-[#536748] underline decoration-[#b8bd9f] underline-offset-4 hover:text-[#8b7048]">
                        View results
                      </Link>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
}
