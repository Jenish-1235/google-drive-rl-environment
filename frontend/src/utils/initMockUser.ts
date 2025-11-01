import { useAuthStore } from '../store/authStore';
import { MOCK_USER } from './constants';

/**
 * Initialize mock user for development
 */
export const initMockUser = () => {
  const authStore = useAuthStore.getState();

  if (!authStore.user) {
    authStore.setUser(MOCK_USER);
    authStore.setToken('mock-token-' + Date.now());
  }
};
