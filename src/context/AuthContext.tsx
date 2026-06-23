import React, { createContext, useContext, useEffect, useState } from 'react';
import { auth } from '../firebase';
import { User, onAuthStateChanged, signOut } from 'firebase/auth';
import toast from 'react-hot-toast';
import { doc, getDoc, serverTimestamp, setDoc } from 'firebase/firestore';
import { db } from '../firebase';

interface UserProfile {
  uid: string;
  displayName?: string;
  email?: string;
  photoURL?: string;
  role?: 'user' | 'admin';
}

interface AuthContextType {
  user: User | null;
  profile: UserProfile | null;
  isAdmin: boolean;
  loading: boolean;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  profile: null,
  isAdmin: false,
  loading: true,
  logout: async () => {},
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      setProfile(null);

      if (currentUser) {
        const userRef = doc(db, 'users', currentUser.uid);
        const userSnap = await getDoc(userRef);

        if (!userSnap.exists()) {
          const newProfile: UserProfile = {
            uid: currentUser.uid,
            displayName: currentUser.displayName || '',
            email: currentUser.email || '',
            photoURL: currentUser.photoURL || '',
            role: 'user',
          };
          await setDoc(userRef, {
            ...newProfile,
            createdAt: serverTimestamp(),
          });
          setProfile(newProfile);
        } else {
          setProfile(userSnap.data() as UserProfile);
        }
      }

      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const logout = async () => {
    await signOut(auth);
    toast.success('Logged out');
  };

  return (
    <AuthContext.Provider value={{ user, profile, isAdmin: profile?.role === 'admin', loading, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
