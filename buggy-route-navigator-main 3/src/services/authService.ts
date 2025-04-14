import { useToast } from "@/components/ui/use-toast";
import { API_BASE_URL } from "@/config";

// Types for authentication
export interface LoginCredentials {
  username: string;
  password: string;
  userType?: 'student' | 'driver';
}

export interface RegisterCredentials {
  username: string;
  email: string;
  password: string;
  first_name: string;
  last_name: string;
  phone_number: string;
}

export interface UserProfile {
  id: number;
  username: string;
  email: string;
  user_type: 'student' | 'driver';
  first_name: string;
  last_name: string;
  phone_number: string;
}

export interface TokenResponse {
  token: string;
  user_type: 'student' | 'driver';
}

// Authentication service functions
export const authService = {
  // Get CSRF token for forms
  getCsrfToken: async (): Promise<string> => {
    try {
      const response = await fetch(`${API_BASE_URL}/user/csrf-token/`, {
        method: 'GET',
        credentials: 'include' // Include cookies
      });

      if (!response.ok) {
        throw new Error('Failed to get CSRF token');
      }

      const data = await response.json();
      return data.csrfToken;
    } catch (error) {
      console.error('CSRF token error:', error);
      throw error;
    }
  },

  // Login user
  login: async (credentials: LoginCredentials): Promise<TokenResponse> => {
    try {
      // Get CSRF token first for secure requests
      const csrfToken = await authService.getCsrfToken();

      const response = await fetch(`${API_BASE_URL}/user/login/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRFToken': csrfToken
        },
        body: JSON.stringify(credentials),
        credentials: 'include' // Include cookies
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || errorData.error || 'Login failed');
      }

      const data = await response.json();

      // Store auth state
      localStorage.setItem('isLoggedIn', 'true');
      localStorage.setItem('userType', data.user_type);
      localStorage.setItem('lastAuthTime', Date.now().toString());

      return data;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  },

  // Register new user
  register: async (credentials: RegisterCredentials): Promise<TokenResponse> => {
    try {
      // Get CSRF token first for secure requests
      const csrfToken = await authService.getCsrfToken();

      const response = await fetch(`${API_BASE_URL}/user/register/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRFToken': csrfToken
        },
        body: JSON.stringify(credentials),
        credentials: 'include' // Include cookies
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || errorData.error || 'Registration failed');
      }

      const data = await response.json();

      // Store auth state
      localStorage.setItem('isLoggedIn', 'true');
      localStorage.setItem('userType', data.user_type);
      localStorage.setItem('lastAuthTime', Date.now().toString());

      return data;
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    }
  },

  // Logout user
  logout: async (): Promise<void> => {
    try {
      // Get CSRF token first for secure requests
      const csrfToken = await authService.getCsrfToken();

      const response = await fetch(`${API_BASE_URL}/user/logout/`, {
        method: 'POST',
        headers: {
          'X-CSRFToken': csrfToken
        },
        credentials: 'include' // Include cookies
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || errorData.error || 'Logout failed');
      }
    } catch (error) {
      console.error('Logout error:', error);
      throw error;
    } finally {
      // Clear local storage regardless of server response
      localStorage.removeItem('isLoggedIn');
      localStorage.removeItem('userType');
      localStorage.removeItem('lastAuthTime');
    }
  },

  // Get user profile
  getProfile: async (): Promise<UserProfile> => {
    try {
      // Check if token needs refreshing
      await authService.refreshTokenIfNeeded();

      const response = await fetch(`${API_BASE_URL}/user/profile/`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include' // Include cookies
      });

      if (!response.ok) {
        const errorData = await response.json();

        // If unauthorized, clear local storage
        if (response.status === 401) {
          localStorage.removeItem('isLoggedIn');
          localStorage.removeItem('userType');
          localStorage.removeItem('lastAuthTime');
        }

        throw new Error(errorData.detail || errorData.error || 'Failed to fetch profile');
      }

      return await response.json();
    } catch (error) {
      console.error('Profile fetch error:', error);
      throw error;
    }
  },

  // Refresh token
  refreshToken: async (): Promise<void> => {
    try {
      // Get CSRF token first for secure requests
      const csrfToken = await authService.getCsrfToken();

      const response = await fetch(`${API_BASE_URL}/user/refresh-token/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRFToken': csrfToken
        },
        credentials: 'include' // Include cookies
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || errorData.error || 'Failed to refresh token');
      }

      // Update last auth time
      localStorage.setItem('lastAuthTime', Date.now().toString());

      return await response.json();
    } catch (error) {
      console.error('Token refresh error:', error);
      throw error;
    }
  },

  // Refresh token if needed (token is older than 6 days)
  refreshTokenIfNeeded: async (): Promise<void> => {
    const lastAuthTime = localStorage.getItem('lastAuthTime');
    if (!lastAuthTime) return;

    const lastAuth = parseInt(lastAuthTime);
    const now = Date.now();
    const sixDaysInMs = 6 * 24 * 60 * 60 * 1000; // 6 days in milliseconds

    // If token is older than 6 days, refresh it
    if (now - lastAuth > sixDaysInMs) {
      await authService.refreshToken();
    }
  },

  // Validate authentication status
  validateAuthStatus: async (): Promise<boolean> => {
    // If user is not logged in according to localStorage, return false
    if (localStorage.getItem('isLoggedIn') !== 'true') {
      return false;
    }

    try {
      // Try to get profile to validate authentication
      await authService.getProfile();
      return true;
    } catch (error) {
      // Clear local storage on authentication failure
      localStorage.removeItem('isLoggedIn');
      localStorage.removeItem('userType');
      localStorage.removeItem('lastAuthTime');
      return false;
    }
  },

  // Check if user is authenticated (local check only)
  isAuthenticated: (): boolean => {
    return localStorage.getItem('isLoggedIn') === 'true';
  },

  // Get user type (student or driver)
  getUserType: (): 'student' | 'driver' | null => {
    const userType = localStorage.getItem('userType');
    if (userType === 'student' || userType === 'driver') {
      return userType;
    }
    return null;
  },

  // Check if current user is a driver
  isDriver: (): boolean => {
    return localStorage.getItem('userType') === 'driver';
  },

  // Check if current user is a student
  isStudent: (): boolean => {
    return localStorage.getItem('userType') === 'student';
  }
};

// Custom hook for authentication
export const useAuth = () => {
  const { toast } = useToast();

  const handleAuthError = (error: any) => {
    const message = error.message || "An error occurred during authentication";
    toast({
      title: "Authentication Error",
      description: message,
      variant: "destructive"
    });
  };

  return {
    login: async (credentials: LoginCredentials) => {
      try {
        return await authService.login(credentials);
      } catch (error) {
        handleAuthError(error);
        throw error;
      }
    },
    register: async (credentials: RegisterCredentials) => {
      try {
        return await authService.register(credentials);
      } catch (error) {
        handleAuthError(error);
        throw error;
      }
    },
    logout: async () => {
      try {
        return await authService.logout();
      } catch (error) {
        handleAuthError(error);
        throw error;
      }
    },
    getProfile: async () => {
      try {
        return await authService.getProfile();
      } catch (error) {
        handleAuthError(error);
        throw error;
      }
    },
    refreshToken: async () => {
      try {
        return await authService.refreshToken();
      } catch (error) {
        handleAuthError(error);
        throw error;
      }
    },
    validateAuthStatus: authService.validateAuthStatus,
    isAuthenticated: authService.isAuthenticated,
    getUserType: authService.getUserType,
    isDriver: authService.isDriver,
    isStudent: authService.isStudent
  };
};
