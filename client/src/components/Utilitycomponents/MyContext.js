import { createContext, useState, useContext, useEffect, useMemo } from 'react';
import LoadingSpinner from '../../utils/LoadingSpinner';

const UserContext = createContext();

const BASE_URL = process.env.REACT_APP_BASE_URL || 'http://localhost:5000/api';

export const UserProvider = ({ children }) => {
  const [userData, setUserData] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    const verifyAuth = async () => {
      try {
        const response = await fetch(`${BASE_URL}/user/me`, {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
        });

        if (!mounted) return;

        if (response.ok) {
          const fetchedUserData = await response.json();
          const { id, role, email, market, name, ...otherData } = fetchedUserData;

          if (!id || !role) {
            throw new Error('Invalid user data');
          }

          setUserData({
            id,
            role,
            email,
            market,
            name,
            ...otherData,
          });
          setIsAuthenticated(true);
        } else {
          setUserData(null);
          setIsAuthenticated(false);
        }
      } catch (err) {
        if (mounted) {
          console.error('Auth verification error:', err);
          setUserData(null);
          setIsAuthenticated(false);
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    verifyAuth();
    return () => {
      mounted = false;
    };
  }, []);

  // Memoize userData to prevent new object references
  const memoizedUserData = useMemo(() => userData, [userData]);

  if (loading) {
    return (
      <LoadingSpinner/>
    );
  }

  return (
    <UserContext.Provider
      value={{
        userData: memoizedUserData,
        setUserData,
        isAuthenticated,
        setIsAuthenticated,
        loading,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export const useUserContext = () => useContext(UserContext);