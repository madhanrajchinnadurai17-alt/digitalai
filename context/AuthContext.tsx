import React, { createContext, useContext, useEffect, useState } from 'react';
import { 
  auth, 
  isFirebaseConfigured, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut as firebaseSignOut,
  onAuthStateChanged,
  User as FirebaseUser
} from '@/lib/firebase';

export interface UserSession {
  uid: string;
  email: string | null;
  displayName?: string | null;
  isDemoUser?: boolean;
}

interface AuthContextType {
  user: UserSession | null;
  loading: boolean;
  isFirebaseConfigured: boolean;
  loginWithEmail: (email: string, pass: string) => Promise<void>;
  signupWithEmail: (email: string, pass: string) => Promise<void>;
  loginAsDemoUser: () => void;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  isFirebaseConfigured: false,
  loginWithEmail: async () => {},
  signupWithEmail: async () => {},
  loginAsDemoUser: () => {},
  logout: async () => {},
});

const DEMO_USER: UserSession = {
  uid: 'demo-user-123',
  email: 'founder@brewandbean.demo',
  displayName: 'Demo Founder',
  isDemoUser: true,
};

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<UserSession | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check localStorage for demo session first
    if (typeof window !== 'undefined') {
      const storedDemo = localStorage.getItem('markai_demo_session');
      if (storedDemo) {
        setUser(JSON.parse(storedDemo));
        setLoading(false);
        return;
      }
    }

    if (isFirebaseConfigured && auth) {
      const unsubscribe = onAuthStateChanged(auth, (fbUser: FirebaseUser | null) => {
        if (fbUser) {
          setUser({
            uid: fbUser.uid,
            email: fbUser.email,
            displayName: fbUser.displayName || fbUser.email?.split('@')[0],
            isDemoUser: false,
          });
        } else {
          setUser(null);
        }
        setLoading(false);
      });
      return () => unsubscribe();
    } else {
      // Default to demo user if no Firebase configuration is present
      setUser(DEMO_USER);
      setLoading(false);
    }
  }, []);

  const loginWithEmail = async (email: string, pass: string) => {
    if (isFirebaseConfigured && auth) {
      await signInWithEmailAndPassword(auth, email, pass);
    } else {
      const demoSession: UserSession = {
        uid: `user_${Date.now()}`,
        email,
        displayName: email.split('@')[0],
        isDemoUser: true,
      };
      setUser(demoSession);
      if (typeof window !== 'undefined') {
        localStorage.setItem('markai_demo_session', JSON.stringify(demoSession));
      }
    }
  };

  const signupWithEmail = async (email: string, pass: string) => {
    if (isFirebaseConfigured && auth) {
      await createUserWithEmailAndPassword(auth, email, pass);
    } else {
      const demoSession: UserSession = {
        uid: `user_${Date.now()}`,
        email,
        displayName: email.split('@')[0],
        isDemoUser: true,
      };
      setUser(demoSession);
      if (typeof window !== 'undefined') {
        localStorage.setItem('markai_demo_session', JSON.stringify(demoSession));
      }
    }
  };

  const loginAsDemoUser = () => {
    setUser(DEMO_USER);
    if (typeof window !== 'undefined') {
      localStorage.setItem('markai_demo_session', JSON.stringify(DEMO_USER));
    }
  };

  const logout = async () => {
    if (isFirebaseConfigured && auth) {
      await firebaseSignOut(auth);
    }
    setUser(null);
    if (typeof window !== 'undefined') {
      localStorage.removeItem('markai_demo_session');
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        isFirebaseConfigured,
        loginWithEmail,
        signupWithEmail,
        loginAsDemoUser,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
