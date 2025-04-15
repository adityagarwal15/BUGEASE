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

// Get CSRF Token for non-GET requests
const getCsrfToken = async (): Promise<string> => {
  try {
    const response = await fetch(`${API_BASE_URL}/user/csrf-token/`, {
      method: 'GET',
      credentials: 'include' // Include cookies
    });

    const data = await response.json();
    return data.csrfToken;
  } catch (error) {
    console.error('Error fetching CSRF token:', error);
    return '';
  }
};

// Authentication service functions
export const authService = {
  // Login user with cookie-based authentication
  login: async (credentials: LoginCredentials): Promise<{ token: string, userType: 'student' | 'driver' }> => {
    try {
      // Get CSRF token for the POST request
      const csrfToken = await getCsrfToken();

      const response = await fetch(`${API_BASE_URL}/user/login/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRFToken': csrfToken
        },
        body: JSON.stringify(credentials),
        credentials: 'include' // Include cookies
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Login failed');
      }

      // Store minimal authentication state in localStorage
      localStorage.setItem('isLoggedIn', 'true');
      localStorage.setItem('userType', data.user_type);
      localStorage.setItem('lastAuthTime', Date.now().toString());

      return {
        token: data.token, // For reference only, not stored in localStorage
        userType: data.user_type
      };
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  },

  // Register new user with cookie-based authentication
  register: async (credentials: RegisterCredentials): Promise<{ token: string, userType: 'student' }> => {
    try {
      // Get CSRF token for the POST request
      const csrfToken = await getCsrfToken();

      const response = await fetch(`${API_BASE_URL}/user/register/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRFToken': csrfToken
        },
        body: JSON.stringify(credentials),
        credentials: 'include' // Include cookies
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Registration failed');
      }

      // Store minimal authentication state in localStorage
      localStorage.setItem('isLoggedIn', 'true');
      localStorage.setItem('userType', 'student');
      localStorage.setItem('lastAuthTime', Date.now().toString());

      return {
        token: data.token, // For reference only, not stored in localStorage
        userType: 'student'
      };
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    }
  },

  // Logout user with cookie-based authentication
  logout: async (): Promise<void> => {
    try {
      // Get CSRF token for the POST request
      const csrfToken = await getCsrfToken();

      const response = await fetch(`${API_BASE_URL}/user/logout/`, {
        method: 'POST',
        headers: {
          'X-CSRFToken': csrfToken
        },
        credentials: 'include' // Include cookies
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Logout failed');
      }
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      // Clear local storage
      localStorage.removeItem('isLoggedIn');
      localStorage.removeItem('userType');
      localStorage.removeItem('lastAuthTime');
    }
  },

  // Get user profile
  getProfile: async (): Promise<UserProfile> => {
    try {
      console.log("Calling profile API with credentials included");
      const response = await fetch(`${API_BASE_URL}/user/profile/`, {
        method: 'GET',
        credentials: 'include', // Include cookies
        headers: {
          'Accept': 'application/json',
          'Cache-Control': 'no-cache' // Prevent caching
        }
      });

      console.log("Profile API response status:", response.status);

      if (!response.ok) {
        const errorData = await response.json();
        console.error("Profile API error:", errorData);
        throw new Error(errorData.detail || errorData.error || 'Failed to fetch profile');
      }

      const data = await response.json();
      console.log("Profile data received:", data);
      return data;
    } catch (error) {
      console.error('Profile fetch error:', error);
      throw error;
    }
  },

  // Refresh authentication token
  refreshToken: async (): Promise<void> => {
    try {
      // Get CSRF token for the POST request
      const csrfToken = await getCsrfToken();

      const response = await fetch(`${API_BASE_URL}/user/refresh-token/`, {
        method: 'POST',
        headers: {
          'X-CSRFToken': csrfToken
        },
        credentials: 'include' // Include cookies
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to refresh token');
      }

      // Update the last authentication time
      localStorage.setItem('lastAuthTime', Date.now().toString());
    } catch (error) {
      console.error('Token refresh error:', error);
      throw error;
    }
  },

  // Check if token needs refresh (older than 6 days)
  needsTokenRefresh: (): boolean => {
    const lastAuthTime = localStorage.getItem('lastAuthTime');
    if (!lastAuthTime) return false;

    const sixDaysInMs = 6 * 24 * 60 * 60 * 1000; // 6 days in milliseconds
    const timeSinceAuth = Date.now() - parseInt(lastAuthTime);

    return timeSinceAuth > sixDaysInMs;
  },

  // Check if user is authenticated
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
  },

  // Validate current authentication by calling profile endpoint
  validateAuth: async (): Promise<boolean> => {
    if (!authService.isAuthenticated()) {
      return false;
    }

    try {
      await authService.getProfile();

      // Check if token needs refresh
      if (authService.needsTokenRefresh()) {
        await authService.refreshToken();
      }

      return true;
    } catch (error) {
      console.error('Auth validation error:', error);

      // Clear auth state if validation fails
      localStorage.removeItem('isLoggedIn');
      localStorage.removeItem('userType');
      localStorage.removeItem('lastAuthTime');

      return false;
    }
  }
};

// Custom hook for authentication
export const useAuth = () => {
  const { toast } = useToast();

  const handleAuthError = (error: any) => {
    toast({
      title: "Authentication Error",
      description: error.message || "An error occurred during authentication",
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
    validateAuth: async () => {
      try {
        return await authService.validateAuth();
      } catch (error) {
        handleAuthError(error);
        return false;
      }
    },
    isAuthenticated: authService.isAuthenticated,
    getUserType: authService.getUserType,
    isDriver: authService.isDriver,
    isStudent: authService.isStudent,
    needsTokenRefresh: authService.needsTokenRefresh
  };
};
