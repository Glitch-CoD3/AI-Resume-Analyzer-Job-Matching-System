import {
  createContext,
  useContext,
  useEffect,
  useState,
} from 'react';

import AxiosInstance from '../api/axiosInstance.jsx';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  const checkAuthStatus = async () => {
    try {
      // console.log('Checking authentication...');

      const response = await AxiosInstance.get('/auth/me');

      console.log('Auth response:', response.data);

      if (response.data.user) {
        setIsAuthenticated(true);

        // console.log('User is authenticated');

        return true;
      }

      setIsAuthenticated(false);

      // console.log('User is NOT authenticated');

      return false;

    } catch (error) {
      console.error(
        'Auth check error:',
        error.response?.status,
        error.response?.data
      );

      setIsAuthenticated(false);

      return false;

    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkAuthStatus();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        loading,
        checkAuthStatus,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error(
      'useAuth must be used inside AuthProvider'
    );
  }

  return context;
};