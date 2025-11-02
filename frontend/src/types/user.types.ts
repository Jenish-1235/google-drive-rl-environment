export interface User {
  id: string;
  email: string;
  name: string;
  photoUrl?: string;
  createdAt: Date;
  lastLoginAt: Date;
}

// Backend user response format
export interface BackendUser {
  id: number;
  email: string;
  name: string;
  avatar_url: string | null;
  storage_used: number;
  storage_limit: number;
  created_at: string;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface SignupCredentials extends LoginCredentials {
  name: string;
}

export interface AuthResponse {
  user: User;
  token: string;
}

export interface BackendAuthResponse {
  user: BackendUser;
  token: string;
}

// Helper to convert backend user to frontend user
export function mapBackendUser(backendUser: BackendUser): User {
  return {
    id: String(backendUser.id),
    email: backendUser.email,
    name: backendUser.name,
    photoUrl: backendUser.avatar_url || undefined,
    createdAt: new Date(backendUser.created_at),
    lastLoginAt: new Date(), // Backend doesn't track this yet
  };
}
