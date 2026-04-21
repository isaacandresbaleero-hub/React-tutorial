import React { createContext, useState, useContext, useEffect } from 'react';
import { login as apiLogin, register as apiRegister } from '../services/api';
import toast from 'react-hot-toast';

const AuthContext = createContext();

export const useAuth = () => {
    const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [token, setToken] = useState(localStorage.getItem('access_token'));

    useEffect(() => {
         const loadUser = async () => {
            const storedUser = localStorage.getItem('user');
            const storedToken = localStorage.getItem('access_token');

             if (storedToken && storedUser) {
        try {
          setToken(storedToken);
          setUser(JSON.parse(storedUser));
          } catch (error) {
          console.error('Error loading user:', error);
          localStorage.clear(); 
        }
      }
      setLoading(false);  // Done checking
    };

     loadUser();
  }, []); // Empty array means "run once when component mounts"

  // LOGIN FUNCTION
  const login = async (username, password) => {
    try {
      // Call the API to login
      const response = await apiLogin(username, password);
      const { access, refresh, user: userData } = response.data;
      
      // Save to localStorage (persists even after browser close)
      localStorage.setItem('access_token', access);
      localStorage.setItem('refresh_token', refresh);
      localStorage.setItem('user', JSON.stringify(userData));

      setToken(access);
      setUser(userData);
      
      // Show success message
      toast.success(`Welcome back, ${userData.username}!`);
      return { success: true, user: userData };
    } catch (error) {
      const message = error.response?.data?.error || 'Login failed';
      toast.error(message);
      return { success: false, error: message };
    }
  };

  const register = async (userData) => {
    try {
      const response = await apiRegister(userData);
      const { access, refresh, user: newUser } = response.data;
      
      localStorage.setItem('access_token', access);
      localStorage.setItem('refresh_token', refresh);
      localStorage.setItem('user', JSON.stringify(newUser));

      setToken(access);
      setUser(newUser);
      
      toast.success('Registration successful!');
      return { success: true, user: newUser };
    } catch (error) {
      const message = error.response?.data?.error || 'Registration failed';
      toast.error(message);
      return { success: false, error: message };
    }
  };

  const logout = () => {
    // Clear everything from localStorage
    localStorage.clear();
    setToken(null);
    setUser(null);
    toast.success('Logged out successfully');
  };

   const value = {
    user,                    // The user object
    token,                   // The auth token
    loading,                 // Loading state
    login,                   // Login function
    register,                // Register function
    logout,                  // Logout function
    isAuthenticated: !!user, // True if user exists
    isStudent: user?.role === 'student',  // Optional chaining (?.) prevents error if user is null
    isWorkplaceSupervisor: user?.role === 'workplace_supervisor',
    isAcademicSupervisor: user?.role === 'academic_supervisor',
    isAdmin: user?.role === 'admin',
  };

   // Provide the value to all children components
  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

            
