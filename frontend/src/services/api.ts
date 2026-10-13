import type { AuthResponse, Issue, Poll, PollResults } from "../types";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(`${API_URL}${path}`, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...init?.headers
    }
  });

  const data: unknown = await response.json().catch(() => ({}));
  if (!response.ok) {
    const message =
      typeof data === "object" && data !== null && "message" in data &&
      typeof data.message === "string"
        ? data.message
        : "Request failed.";
    throw new Error(message);
  }
  return data as T;
}

export const api = {
  register: (name: string, email: string, password: string) =>
    request<AuthResponse>("/auth/register", {
      method: "POST",
      body: JSON.stringify({ name, email, password })
    }),
  login: (email: string, password: string) =>
    request<AuthResponse>("/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password })
    }),
  getPolls: () => request<Poll[]>("/polls"),
  createPoll: (question: string, options: string[], category: string, closesAt: string) =>
    request<Poll>("/polls", {
      method: "POST",
      body: JSON.stringify({ question, options, category, closesAt: closesAt || undefined })
    }),
  vote: (pollId: string, optionId: string, voterId: string) =>
    request<Poll>(`/polls/${pollId}/vote`, {
      method: "POST",
      body: JSON.stringify({ optionId, voterId })
    }),
  getResults: (pollId: string) =>
    request<PollResults>(`/polls/${pollId}/results`),
  getIssues: () => request<Issue[]>("/issues"),
  createIssue: (title: string, description: string, category: string) =>
    request<Issue>("/issues", {
      method: "POST",
      body: JSON.stringify({ title, description, category })
    })
};
