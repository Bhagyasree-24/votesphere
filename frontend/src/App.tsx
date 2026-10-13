import { NavLink, Navigate, Route, Routes, useNavigate } from "react-router-dom";
import HomePage from "./pages/HomePage";
import IssuePage from "./pages/IssuePage";
import LoginPage from "./pages/LoginPage";
import CreatePollPage from "./pages/CreatePollPage";
import PollsPage from "./pages/PollsPage";
import PollResultsPage from "./pages/PollResultsPage";
import RegisterPage from "./pages/RegisterPage";

function getStoredUser() {
  try {
    const rawUser = localStorage.getItem("votesphere_user");
    return rawUser ? JSON.parse(rawUser) : null;
  } catch {
    return null;
  }
}

export default function App() {
  const navigate = useNavigate();
  const currentUser = getStoredUser();

  function handleLogout() {
    localStorage.removeItem("votesphere_token");
    localStorage.removeItem("votesphere_user");
    navigate("/");
    window.location.reload();
  }

  return (
    <div className="min-h-screen bg-[#f5f3ed] text-[#252722]">
      <header className="sticky top-0 z-30 border-b border-[#e5e2d9] bg-[#fbfaf6]/95 backdrop-blur-md">
        <div className="mx-auto flex max-w-[1440px] flex-wrap items-center justify-between gap-x-8 gap-y-3 px-4 py-3 sm:px-6 lg:px-10">
          <NavLink to="/" className="flex items-center gap-2.5 text-[#252722]">
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[#263c33] text-base font-black text-white">
              V
            </span>
            <span className="text-xl font-extrabold tracking-[-0.05em]">VoteSphere</span>
          </NavLink>

          <nav aria-label="Main navigation" className="order-3 flex w-full items-center justify-center gap-5 border-t border-[#e5e2d9] pt-3 text-[11px] font-semibold text-[#5d6057] sm:order-none sm:w-auto sm:gap-7 sm:border-0 sm:pt-0 sm:text-sm">
            <NavLink to="/" className={({ isActive }) => (isActive ? "text-[#263c33]" : "transition hover:text-[#263c33]")}>Home</NavLink>
            <NavLink to="/polls" className={({ isActive }) => (isActive ? "text-[#263c33]" : "transition hover:text-[#263c33]")}>Explore polls</NavLink>
            <NavLink to="/polls/create" className={({ isActive }) => (isActive ? "text-[#263c33]" : "transition hover:text-[#263c33]")}>Create poll</NavLink>
            <NavLink to="/issues" className={({ isActive }) => (isActive ? "text-[#263c33]" : "transition hover:text-[#263c33]")}>Community issues</NavLink>
          </nav>

          <div className="flex items-center gap-3">
            {currentUser ? (
              <>
                <span className="hidden max-w-32 truncate text-xs font-semibold text-[#5d6057] sm:inline-flex">
                  {currentUser.name}
                </span>
                <button
                  type="button"
                  onClick={handleLogout}
                  className="rounded-full border border-[#d9d6cc] px-4 py-2 text-sm font-bold text-[#30332d] transition hover:bg-[#eeece4]"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <NavLink to="/login" className="hidden px-2 py-2 text-sm font-semibold text-[#464a42] transition hover:text-[#263c33] sm:inline-flex">
                  Login
                </NavLink>
                <NavLink to="/register" className="rounded-full bg-[#263c33] px-4 py-2 text-sm font-bold text-white transition hover:bg-[#385447]">
                  Join VoteSphere
                </NavLink>
              </>
            )}
          </div>
        </div>
      </header>

      <main>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={currentUser ? <Navigate to="/polls" replace /> : <LoginPage />} />
          <Route path="/register" element={currentUser ? <Navigate to="/polls" replace /> : <RegisterPage />} />
          <Route path="/polls/create" element={<CreatePollPage />} />
          <Route path="/polls/:pollId/results" element={<PollResultsPage />} />
          <Route path="/polls" element={<PollsPage />} />
          <Route path="/issues" element={<IssuePage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
    </div>
  );
}
