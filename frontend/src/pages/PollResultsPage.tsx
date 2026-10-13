import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { api } from "../services/api";
import type { PollResults } from "../types";

export default function PollResultsPage() {
  const { pollId = "" } = useParams();
  const [results, setResults] = useState<PollResults | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isActive = true;

    api.getResults(pollId)
      .then((data) => {
        if (isActive) setResults(data);
      })
      .catch((err: unknown) => {
        if (isActive) setError(err instanceof Error ? err.message : "Unable to load poll results.");
      })
      .finally(() => {
        if (isActive) setLoading(false);
      });

    return () => {
      isActive = false;
    };
  }, [pollId]);

  const isClosed = results?.closesAt ? new Date(results.closesAt).getTime() <= Date.now() : false;

  return (
    <div className="min-h-screen bg-[#f5f3ed] text-[#252722]">
      <section className="mx-auto max-w-[1440px] px-3 pt-4 sm:px-6 lg:px-10">
        <div
          className="relative flex min-h-[260px] items-center overflow-hidden bg-cover bg-center px-6 py-10 text-white sm:min-h-[320px] sm:px-12 lg:px-16"
          style={{ backgroundImage: "linear-gradient(90deg, rgba(25, 34, 28, .8), rgba(25, 34, 28, .32) 65%, rgba(25, 34, 28, .08)), url('https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=1800&q=85')" }}
        >
          <div className="max-w-2xl">
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/80">VoteSphere results</p>
            <h1 className="mt-3 max-w-xl text-4xl font-extrabold leading-[1.05] tracking-[-0.055em] sm:text-5xl">Every voice adds perspective.</h1>
            <p className="mt-3 max-w-lg text-sm leading-6 text-white/85">See how your community responded and what the group thinks.</p>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-4 py-9 sm:px-6 lg:px-10">
        {loading ? (
          <p className="py-16 text-center text-sm font-semibold text-[#77766b]">Loading results...</p>
        ) : error || !results ? (
          <div className="py-12 text-center">
            <p role="alert" className="text-sm font-semibold text-[#8f453c]">{error || "Poll results are not available."}</p>
            <Link to="/polls" className="mt-4 inline-flex border-b border-[#b8bd9f] pb-1 text-xs font-bold text-[#536748]">Back to polls</Link>
          </div>
        ) : (
          <>
            <div className="flex flex-col gap-5 border-b border-[#dfdcd2] pb-6 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#87877b]">{results.category || "Community poll"}</p>
                <h2 className="mt-2 max-w-3xl text-2xl font-extrabold leading-tight tracking-[-0.04em] text-[#252722] sm:text-3xl">{results.question}</h2>
              </div>
              <div className="shrink-0 sm:text-right">
                <p className="text-3xl font-extrabold tracking-[-0.05em] text-[#394c3d]">{results.totalVotes}</p>
                <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#87877b]">Total votes</p>
              </div>
            </div>

            <div className="py-7">
              <div className="mb-5 flex flex-wrap items-center justify-between gap-3 text-xs text-[#77766b]">
                <span>{isClosed ? "Poll closed" : "Poll is open"}</span>
                {results.closesAt ? <span>Closes {new Date(results.closesAt).toLocaleDateString()}</span> : <span>No closing date set</span>}
              </div>

              <div className="space-y-5">
                {results.options
                  .slice()
                  .sort((first, second) => second.votes - first.votes)
                  .map((option, index) => (
                    <article key={option.id} className="border-b border-[#e3e0d7] pb-5">
                      <div className="mb-2 flex items-start justify-between gap-4">
                        <div className="flex min-w-0 items-start gap-3">
                          <span className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-[10px] font-bold ${index === 0 && results.totalVotes > 0 ? "bg-[#697b51] text-white" : "bg-[#e9e5d9] text-[#697352]"}`}>
                            {String(index + 1).padStart(2, "0")}
                          </span>
                          <h3 className="pt-1 text-sm font-semibold text-[#363830]">{option.text}</h3>
                        </div>
                        <div className="shrink-0 text-right">
                          <span className="text-lg font-extrabold text-[#30352d]">{option.percentage}%</span>
                          <span className="ml-2 text-[10px] text-[#87877b]">{option.votes} votes</span>
                        </div>
                      </div>
                      <div className="ml-10 h-2 overflow-hidden bg-[#e9e6dc]">
                        <div
                          className={`h-full transition-all duration-700 ${index === 0 && results.totalVotes > 0 ? "bg-[#697b51]" : "bg-[#c4ad5c]"}`}
                          style={{ width: `${option.percentage}%` }}
                        />
                      </div>
                    </article>
                  ))}
              </div>

              {results.totalVotes === 0 ? <p className="mt-5 text-sm text-[#77766b]">No votes yet. Be the first to share your choice.</p> : null}
            </div>

            <div className="flex flex-col gap-3 border-t border-[#dfdcd2] pt-5 sm:flex-row sm:items-center sm:justify-between">
              <Link to="/polls" className="text-center text-xs font-bold text-[#536748] underline decoration-[#b8bd9f] underline-offset-4 hover:text-[#8b7048]">Explore other polls</Link>
              {!isClosed ? (
                <Link to="/polls" className="rounded-xl bg-[#e8c84f] px-6 py-3 text-center text-xs font-bold text-[#29291f] transition hover:bg-[#f0d66c]">Cast your vote</Link>
              ) : null}
            </div>
          </>
        )}
      </section>
    </div>
  );
}
