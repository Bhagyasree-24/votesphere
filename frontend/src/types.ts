export interface PollOption {
  _id: string;
  text: string;
  votes: number;
}

export interface Poll {
  _id: string;
  question: string;
  category?: string;
  closesAt?: string | null;
  options: PollOption[];
  voters: string[];
  createdAt: string;
}

export interface PollResults {
  pollId: string;
  question: string;
  category?: string;
  closesAt?: string | null;
  totalVotes: number;
  options: {
    id: string;
    text: string;
    votes: number;
    percentage: number;
  }[];
}

export interface User {
  id: string;
  name: string;
  email: string;
}

export interface AuthResponse {
  message: string;
  token: string;
  user: User;
}

export interface Issue {
  _id: string;
  title: string;
  description: string;
  category: string;
  status: string;
  createdAt: string;
}
