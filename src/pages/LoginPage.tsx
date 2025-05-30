import React, { useState } from 'react';
import { auth, googleProvider } from '../firebase';
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup
} from 'firebase/auth';
import { useNavigate, useLocation } from 'react-router-dom';
import toast from 'react-hot-toast';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isNewUser, setIsNewUser] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from || '/';
  const message = location.state?.message;

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      if (isNewUser) {
        await createUserWithEmailAndPassword(auth, email, password);
        toast.success('Account created!');
      } else {
        await signInWithEmailAndPassword(auth, email, password);
        toast.success('Logged in!');
      }
      navigate(from);
    } catch (err: any) {
      setError(err.message);
      toast.error(err.message);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
      toast.success('Signed in with Google!');
      navigate(from);
    } catch (err: any) {
      setError(err.message);
      toast.error(err.message);
    }
  };

  return (
    <div className="max-w-md mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">{isNewUser ? 'Sign Up' : 'Log In'}</h1>

      {message && (
        <div className="mb-4 text-sm text-yellow-700 bg-yellow-100 border border-yellow-300 p-3 rounded">
          {message}
        </div>
      )}

      <form onSubmit={handleEmailAuth} className="space-y-4">
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          className="w-full border p-2 rounded"
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          className="w-full border p-2 rounded"
        />
        {error && <div className="text-red-600 text-sm">{error}</div>}
        <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded w-full">
          {isNewUser ? 'Create Account' : 'Log In'}
        </button>
      </form>

      <div className="my-4 text-sm text-gray-500 text-center">or</div>

        <button
        onClick={handleGoogleLogin}
        className="w-full border border-gray-300 px-4 py-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center justify-center space-x-3"
        >
        <img
            src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
            alt="Google"
            className="w-5 h-5"
        />
        <span>Sign in with Google</span>
        </button>


      <div className="mt-4 text-center">
        <button onClick={() => setIsNewUser(!isNewUser)} className="text-blue-600 underline text-sm">
          {isNewUser ? 'Already have an account? Log in' : 'New here? Create an account'}
        </button>
      </div>
    </div>
  );
};

export default LoginPage;
