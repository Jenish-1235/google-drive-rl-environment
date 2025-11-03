import { useEffect, useRef } from 'react';
import { useAuthStore } from '../store/authStore';
import { DUMMY_USER_CREDENTIALS } from '../utils/constants';

/**
 * Hook to automatically log in the user with dummy credentials if not authenticated
 * This is used for Docker deployment to bypass authentication
 */
export const useAutoLogin = () => {
  const { isAuthenticated, isLoading, login } = useAuthStore();
  const loginAttempted = useRef(false);

  useEffect(() => {
    const attemptAutoLogin = async () => {
      // Only attempt auto-login once
      if (loginAttempted.current) return;

      // Don't auto-login if already authenticated or still loading
      if (isAuthenticated || isLoading) return;

      loginAttempted.current = true;

      try {
        console.log('🔐 Attempting auto-login with dummy credentials...');
        await login(DUMMY_USER_CREDENTIALS);
        console.log('✅ Auto-login successful');
      } catch (error) {
        console.error('❌ Auto-login failed:', error);
        // Reset the flag to allow retry if needed
        loginAttempted.current = false;
      }
    };

    attemptAutoLogin();
  }, [isAuthenticated, isLoading, login]);
};
