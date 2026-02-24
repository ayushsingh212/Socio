import { useState, useEffect } from 'react';
import { User } from '@/types/layout.types';

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check auth status
    const checkAuth = async () => {
      try {
        // Replace with your actual auth check
        const token = localStorage.getItem('authToken');
        if (token) {
          // Fetch user data
          setUser({
            id: '1',
            name: 'John Doe',
            username: '@johndoe',
            isAuthenticated: true
          });
        }
      } catch (error) {
        console.error('Auth check failed:', error);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  const login = () => {
    // Implement login logic
    console.log('Login clicked');
  };

  const signup = () => {
    // Implement signup logic
    console.log('Signup clicked');
  };

  const logout = () => {
    localStorage.removeItem('authToken');
    setUser(null);
    // Redirect to home
  };

  return {
    user,
    loading,
    login,
    signup,
    logout,
    isAuthenticated: true
  };
}