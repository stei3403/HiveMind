import React, { createContext, useContext, useEffect, useState } from 'react';
import { auth } from '../firebase';
import { User, onAuthStateChanged, signOut } from 'firebase/auth';
import toast from 'react-hot-toast';
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebase';

// This function creates or updates the user profile in Firestore
const createOrUpdateUserProfile = async (user: User) => {
  const userRef = doc(db, 'users', user.uid);
  const userDoc = await getDoc(userRef);

  const profileData = {
    displayName: user.displayName || user.email || 'Anonymous',
    email: user.email,
    photoURL: user.photoURL || '',
    updatedAt: serverTimestamp(),
  };

  if (!userDoc.exists()) {
    await setDoc(userRef, {
      ...profileData,
      createdAt: serverTimestamp()
    });
  } else {
    await setDoc(userRef, profileData, { merge: true });
  }
};

interface AuthContextType {
  user: User | null;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  logout: async () => {},
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        await createOrUpdateUserProfile(currentUser);
      }
    });

    return () => unsubscribe();
  }, []);

  const logout = async () => {
    await signOut(auth);
    toast.success('Logged out');
  };

  return (
    <AuthContext.Provider value={{ user, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
