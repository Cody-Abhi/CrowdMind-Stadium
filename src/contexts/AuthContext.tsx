import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { 
  auth, 
  db, 
  googleProvider,
  signInWithPopup,
  signOut,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  updateProfile,
  doc,
  setDoc,
  getDoc,
  FirebaseUser
} from '../firebase';

export type UserRole = 'admin' | 'engineer' | 'technician' | 'auditor' | 'fan' | 'volunteer';
/** Elevated roles that can only be granted by an admin — not self-selectable at sign-up. */
export const ELEVATED_ROLES: UserRole[] = ['admin', 'engineer', 'technician', 'auditor'];
/** Roles available during public self-service sign-up. */
export const SELF_SERVICE_ROLES: UserRole[] = ['fan', 'volunteer'];

export interface UserProfile {
  uid: string;
  name: string;
  email: string;
  role: UserRole;
  createdAt: string;
}

interface AuthContextType {
  currentUser: FirebaseUser | null;
  userProfile: UserProfile | null;
  loading: boolean;
  error: string | null;
  loginWithEmail: (email: string, pass: string) => Promise<void>;
  registerWithEmail: (email: string, pass: string, name: string, role: UserRole) => Promise<void>;
  loginWithGoogle: (role: UserRole) => Promise<void>;
  logout: () => Promise<void>;
  /** Admin-only: throws if the current user is not an admin. */
  updateUserRole: (newRole: UserRole) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [currentUser, setCurrentUser] = useState<FirebaseUser | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user);
      if (user) {
        // Fetch or create Firestore Profile
        try {
          const userDocRef = doc(db, 'users', user.uid);
          const docSnap = await getDoc(userDocRef);
          
          if (docSnap.exists()) {
            setUserProfile(docSnap.data() as UserProfile);
          } else {
            // Fallback default profile if registered elsewhere
            const defaultProfile: UserProfile = {
              uid: user.uid,
              name: user.displayName || 'Operator',
              email: user.email || '',
              role: 'technician',
              createdAt: new Date().toISOString()
            };
            await setDoc(userDocRef, defaultProfile);
            setUserProfile(defaultProfile);
          }
        } catch (err: unknown) {
          const message = err instanceof Error ? err.message : 'Failed to load user profile';
          console.error('Error fetching user profile:', err);
          setError(message);
        }
      } else {
        setUserProfile(null);
      }
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const loginWithEmail = async (email: string, pass: string) => {
    setError(null);
    setLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email, pass);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to login';
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const registerWithEmail = async (email: string, pass: string, name: string, role: UserRole) => {
    setError(null);
    setLoading(true);
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, pass);
      const user = userCredential.user;
      
      await updateProfile(user, { displayName: name });

      // Save user profile with role selection to Firestore
      const newProfile: UserProfile = {
        uid: user.uid,
        name,
        email,
        role,
        createdAt: new Date().toISOString()
      };

      await setDoc(doc(db, 'users', user.uid), newProfile);
      setUserProfile(newProfile);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to register';
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const loginWithGoogle = async (selectedRole: UserRole) => {
    setError(null);
    setLoading(true);
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;

      // Check if profile exists already
      const userDocRef = doc(db, 'users', user.uid);
      const docSnap = await getDoc(userDocRef);

      if (!docSnap.exists()) {
        // Create new Firestore document with chosen role
        const newProfile: UserProfile = {
          uid: user.uid,
          name: user.displayName || 'Google User',
          email: user.email || '',
          role: selectedRole,
          createdAt: new Date().toISOString()
        };
        await setDoc(userDocRef, newProfile);
        setUserProfile(newProfile);
      } else {
        setUserProfile(docSnap.data() as UserProfile);
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to login with Google';
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    setError(null);
    setLoading(true);
    try {
      await signOut(auth);
      setUserProfile(null);
      setCurrentUser(null);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to logout';
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateUserRole = async (newRole: UserRole) => {
    if (!currentUser) return;
    // Security: only admin users may change roles.
    if (userProfile?.role !== 'admin') {
      const err = new Error('Permission denied: only administrators can change user roles.');
      setError(err.message);
      throw err;
    }
    setError(null);
    try {
      const userDocRef = doc(db, 'users', currentUser.uid);
      await setDoc(userDocRef, { role: newRole }, { merge: true });
      setUserProfile(prev => prev ? { ...prev, role: newRole } : null);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to update user role';
      setError(message);
      throw err;
    }
  };

  return (
    <AuthContext.Provider value={{
      currentUser,
      userProfile,
      loading,
      error,
      loginWithEmail,
      registerWithEmail,
      loginWithGoogle,
      logout,
      updateUserRole
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
