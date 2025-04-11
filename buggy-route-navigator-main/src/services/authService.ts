import { useToast } from "@/components/ui/use-toast";
import { API_BASE_URL } from "@/config";

// Types for authentication
export interface LoginCredentials {
  username: string;
  password: string;
  userType?: 'student' | 'driver'; // Added user type for login
}

export interface RegisterCredentials {
  username: string;
  email: string;
  password: string;
}

export interface UserProfile {
  id: number;
  username: string;
  email: string;
  user_type: 'student' | 'driver';
}

// Authentication service functions
export const authService = {
  // Login user and get token
  login: async (credentials: LoginCredentials): Promise<{ token: string, userType: 'student' | 'driver' }> => {
    try {
      const response = await fetch(`${API_BASE_URL}/user/login/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'ngrok-skip-browser-warning': 'true',
        },
        body: JSON.stringify(credentials)
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Login failed');
      }

      // Store token and user type in localStorage
      localStorage.setItem('authToken', data.token);
      localStorage.setItem('isLoggedIn', 'true');
      localStorage.setItem('userType', data.user_type); // Store user type

      return {
        token: data.token,
        userType: data.user_type
      };
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  },

  // Register new user (students only)
  register: async (credentials: RegisterCredentials): Promise<{ token: string, userType: 'student' }> => {
    try {
      const response = await fetch(`${API_BASE_URL}/user/register/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'ngrok-skip-browser-warning': 'true',
        },
        body: JSON.stringify(credentials)
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Registration failed');
      }

      // Store token and user type in localStorage
      localStorage.setItem('authToken', data.token);
      localStorage.setItem('isLoggedIn', 'true');
      localStorage.setItem('userType', 'student'); // Students only for registration

      return {
        token: data.token,
        userType: 'student' // Students only for registration
      };
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    }
  },

  // Logout user
  logout: async (): Promise<void> => {
    const token = localStorage.getItem('authToken');

    if (!token) {
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/user/logout/`, {
        method: 'POST',
        headers: {
          'Authorization': `Token ${token}`,
          'ngrok-skip-browser-warning': 'true',
        }
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Logout failed');
      }
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      // Clear local storage regardless of server response
      localStorage.removeItem('authToken');
      localStorage.removeItem('isLoggedIn');
      localStorage.removeItem('userType');
    }
  },

  // Get user profile
  getProfile: async (): Promise<UserProfile> => {
    const token = localStorage.getItem('authToken');

    if (!token) {
      throw new Error('No authentication token found');
    }

    try {
      const response = await fetch(`${API_BASE_URL}/user/profile/`, {
        method: 'GET',
        headers: {
          'Authorization': `Token ${token}`,
          'ngrok-skip-browser-warning': 'true',
        }
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch profile');
      }

      return data;
    } catch (error) {
      console.error('Profile fetch error:', error);
      throw error;
    }
  },

  // Check if user is authenticated
  isAuthenticated: (): boolean => {
    return localStorage.getItem('authToken') !== null;
  },

  // Get authentication token
  getToken: (): string | null => {
    return localStorage.getItem('authToken');
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
    isAuthenticated: authService.isAuthenticated,
    getToken: authService.getToken,
    getUserType: authService.getUserType,
    isDriver: authService.isDriver,
    isStudent: authService.isStudent
  };
};
