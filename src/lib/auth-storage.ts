const TOKEN_STORAGE_KEY = 'ecommerce_api_bearer_token';

export const authStorage = {
  getToken: (): string | null => {
    try {
      if (typeof window === 'undefined') return null;
      return localStorage.getItem(TOKEN_STORAGE_KEY);
    } catch {
      return null;
    }
  },

  setToken: (token: string): void => {
    try {
      if (typeof window === 'undefined') return;
      if (token) {
        localStorage.setItem(TOKEN_STORAGE_KEY, token.trim());
      } else {
        localStorage.removeItem(TOKEN_STORAGE_KEY);
      }
    } catch (e) {
      console.error('Failed to save auth token to localStorage', e);
    }
  },

  clearToken: (): void => {
    try {
      if (typeof window === 'undefined') return;
      localStorage.removeItem(TOKEN_STORAGE_KEY);
    } catch (e) {
      console.error('Failed to clear auth token from localStorage', e);
    }
  }
};
