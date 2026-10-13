import { Link } from "react-router-dom";

const categories = [
  { label: "Campus", image: "photo-1523580494863-6f3031224c94" },
  { label: "Community", image: "photo-1529156069898-49953e39b3ac" },
  { label: "Events", image: "photo-1511632765486-a01980e01a18" },
  { label: "Facilities", image: "photo-1497366754035-f200968a6e72" },
  { label: "Wellbeing", image: "photo-1521737711867-e3b97375f902" },
  { label: "Ideas", image: "photo-1528605248644-14dd04022da1" }
];

const trendingPolls = [
  { question: "Should the student union expand weekend workshops?", category: "Campus life", votes: "1,482 votes", image: "photo-1523240795612-9a054b0db644" },
  { question: "What should our next community event be?", category: "Events", votes: "924 votes", image: "photo-1511632765486-a01980e01a18" },
  { question: "Which campus space needs an upgrade first?", category: "Facilities", votes: "2,304 votes", image: "photo-1497366754035-f200968a6e72" },
  { question: "How should we improve student wellbeing?", category: "Wellbeing", votes: "738 votes", image: "photo-1521737711867-e3b97375f902" }
];

const imageUrl = (id: string, width: number) =>
  `https://images.unsplash.com/${id}?auto=format&fit=crop&w=${width}&q=85`;

export default function HomePage() {
  return (
    <div className="min-h-screen bg-[#f5f3ed] text-[#252722]">
      <section className="mx-auto max-w-[1440px] px-3 pt-4 sm:px-6 lg:px-10">
        <div
          className="relative isolate flex min-h-[400px] items-center overflow-hidden rounded-[4px] bg-[#4e554b] bg-cover bg-center px-6 py-12 text-white sm:min-h-[470px] sm:px-12 lg:px-16"
          style={{ backgroundImage: `linear-gradient(90deg, rgba(21, 29, 25, .76) 0%, rgba(21, 29, 25, .36) 50%, rgba(21, 29, 25, .05) 100%), url('${imageUrl("photo-1523240795612-9a054b0db644", 1800)}')` }}
        >
          <div className="max-w-xl">
            <span className="inline-flex rounded-full border border-white/35 bg-black/10 px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.19em] text-white">
              Decisions, together
            </span>
            <h1 className="mt-5 max-w-lg font-[Manrope,sans-serif] text-4xl font-extrabold leading-[1.03] tracking-[-0.055em] sm:text-5xl lg:text-6xl">
              Your voice shapes what comes next.
            </h1>
            <p className="mt-4 max-w-md text-sm leading-6 text-white/85 sm:text-base">
              Join your community in the conversations that make campus life better.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link to="/polls" className="rounded-[3px] bg-[#f7f4eb] px-5 py-3 text-xs font-bold text-[#252722] transition hover:bg-white">
                Explore live polls
              </Link>
              <Link to="/issues" className="rounded-[3px] border border-white/70 bg-black/10 px-5 py-3 text-xs font-bold text-white transition hover:bg-white/15">
                Raise an issue
              </Link>
            </div>
          </div>

          <div className="absolute bottom-5 right-5 hidden w-64 border border-white/25 bg-[#fbfaf6]/95 p-4 text-[#252722] shadow-xl sm:block lg:bottom-8 lg:right-8">
            <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-[0.15em] text-[#6b7065]">
              <span>Live question</span><span className="text-[#a46d45]">Open now</span>
            </div>
            <h2 className="mt-3 text-lg font-bold leading-6">What should improve on campus first?</h2>
            <div className="mt-4 flex items-center justify-between border-t border-[#e6e2d8] pt-3 text-xs text-[#66695f]">
              <span>Facilities · 248 votes</span><Link to="/polls" className="font-bold text-[#263c33]">Vote →</Link>
            </div>
          </div>

          <div className="absolute bottom-0 left-0 right-0 hidden h-1 bg-white/20 sm:block">
            <div className="h-full w-[64%] bg-[#d0a477]" />
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-[1440px] px-4 py-8 sm:px-6 lg:px-10">
        <div className="grid grid-cols-3 gap-4 sm:grid-cols-6 sm:gap-6">
          {categories.map((category) => (
            <Link key={category.label} to="/polls" className="group flex min-w-0 flex-col items-center gap-2 text-center">
              <img
                src={imageUrl(category.image, 240)}
                alt=""
                className="aspect-square w-full max-w-[92px] rounded-full object-cover ring-1 ring-[#e4e0d6] transition duration-300 group-hover:scale-[1.04] group-hover:ring-[#aeb6a4] sm:max-w-[108px]"
              />
              <span className="text-xs font-semibold text-[#373a33] sm:text-sm">{category.label}</span>
            </Link>
          ))}
        </div>
      </section>

      <section className="mx-auto grid max-w-[1440px] gap-3 px-3 pb-10 sm:grid-cols-2 sm:px-6 lg:px-10">
        <Link
          to="/issues"
          className="group relative flex min-h-[190px] items-end overflow-hidden bg-cover bg-center p-5 text-white sm:min-h-[220px] sm:p-7"
          style={{ backgroundImage: `linear-gradient(90deg, rgba(24, 32, 26, .62), rgba(24, 32, 26, .05)), url('${imageUrl("photo-1497366754035-f200968a6e72", 900)}')` }}
        >
          <div>
            <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/80">Community voice</span>
            <h2 className="mt-2 max-w-xs text-2xl font-extrabold leading-tight">Bring an issue to the table.</h2>
            <span className="mt-4 inline-flex border-b border-white pb-1 text-xs font-bold">Raise an issue <span className="ml-2 transition group-hover:translate-x-1">→</span></span>
          </div>
        </Link>
        <Link
          to="/polls"
          className="group relative flex min-h-[190px] items-end overflow-hidden bg-cover bg-center p-5 text-white sm:min-h-[220px] sm:p-7"
          style={{ backgroundImage: `linear-gradient(90deg, rgba(24, 32, 26, .62), rgba(24, 32, 26, .05)), url('${imageUrl("photo-1511632765486-a01980e01a18", 900)}')` }}
        >
          <div>
            <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/80">The latest conversations</span>
            <h2 className="mt-2 max-w-xs text-2xl font-extrabold leading-tight">Discover what people are deciding.</h2>
            <span className="mt-4 inline-flex border-b border-white pb-1 text-xs font-bold">Browse polls <span className="ml-2 transition group-hover:translate-x-1">→</span></span>
          </div>
        </Link>
      </section>

      <section className="mx-auto max-w-[1440px] px-4 pb-16 sm:px-6 lg:px-10">
        <div className="mb-5 flex items-end justify-between gap-4">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#87877b]">Have your say</p>
            <h2 className="mt-1 text-2xl font-extrabold tracking-[-0.04em] text-[#252722] sm:text-3xl">Trending polls</h2>
          </div>
          <Link to="/polls" className="shrink-0 text-xs font-bold text-[#394c3d] transition hover:text-[#9a6847]">View all <span aria-hidden="true">→</span></Link>
        </div>

        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-5">
          {trendingPolls.map((poll) => (
            <article key={poll.question} className="group min-w-0">
              <Link to="/polls" className="block overflow-hidden bg-[#e7e3d9]">
                <img
                  src={imageUrl(poll.image, 600)}
                  alt=""
                  className="aspect-[1.12] w-full object-cover transition duration-500 group-hover:scale-[1.04]"
                  loading="lazy"
                />
              </Link>
              <div className="pt-3">
                <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-[#8a806f]">{poll.category}</p>
                <h3 className="mt-1 line-clamp-2 min-h-10 text-sm font-bold leading-5 text-[#292b25] sm:text-base">{poll.question}</h3>
                <div className="mt-2 flex items-center justify-between gap-2 text-[11px] text-[#77786f]">
                  <span>{poll.votes}</span>
                  <Link to="/polls" className="font-bold text-[#394c3d] hover:text-[#9a6847]">Vote now</Link>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}
