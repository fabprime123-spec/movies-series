import React, { createContext, useContext, useEffect, useState } from 'react';
import { 
  auth, 
  signInWithGoogle, 
  signInAsGuest, 
  logoutUser, 
  mapFirebaseUser 
} from '../lib/firebase';
import { onAuthStateChanged, User as FirebaseUser } from 'firebase/auth';
import { UserProfile } from '../types';

interface AuthContextType {
  currentUser: UserProfile | null;
  rawUser: FirebaseUser | null;
  isLoading: boolean;
  isAuthModalOpen: boolean;
  openAuthModal: () => void;
  closeAuthModal: () => void;
  loginGoogle: () => Promise<void>;
  loginGuest: () => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(null);
  const [rawUser, setRawUser] = useState<FirebaseUser | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState<boolean>(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setRawUser(user);
      setCurrentUser(mapFirebaseUser(user));
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const openAuthModal = () => setIsAuthModalOpen(true);
  const closeAuthModal = () => setIsAuthModalOpen(false);

  const loginGoogle = async () => {
    try {
      await signInWithGoogle();
      setIsAuthModalOpen(false);
    } catch (error) {
      console.error('Login with Google failed', error);
      throw error;
    }
  };

  const loginGuest = async () => {
    try {
      await signInAsGuest();
      setIsAuthModalOpen(false);
    } catch (error) {
      console.error('Guest login failed', error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      await logoutUser();
    } catch (error) {
      console.error('Logout failed', error);
      throw error;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        rawUser,
        isLoading,
        isAuthModalOpen,
        openAuthModal,
        closeAuthModal,
        loginGoogle,
        loginGuest,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
