import api from "./api";
import   {
  type LoginCredentials,
  type SignupCredentials,
  type AuthResponse,
  type BackendAuthResponse,
  mapBackendUser,
} from "../types/user.types";

export const authService = {
  // Register new user
  register: async (credentials: SignupCredentials): Promise<AuthResponse> => {
    const response = await api.post<BackendAuthResponse>("/auth/register", credentials);
    return {
      user: mapBackendUser(response.data.user),
      token: response.data.token,
    };
  },

  // Login user
  login: async (credentials: LoginCredentials): Promise<AuthResponse> => {
    const response = await api.post<BackendAuthResponse>("/auth/login", credentials);
    return {
      user: mapBackendUser(response.data.user),
      token: response.data.token,
    };
  },

  // Get current user
  getCurrentUser: async () => {
    const response = await api.get<{ user: BackendAuthResponse["user"] }>("/auth/me");
    return mapBackendUser(response.data.user);
  },

  // Logout (client-side only)
  logout: () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
  },
};

export default authService;
