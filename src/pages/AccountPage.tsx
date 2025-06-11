import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { updateProfile, updatePassword } from 'firebase/auth';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { storage } from '../firebase';

const AccountPage = () => {
  const { user } = useAuth();
  const [displayName, setDisplayName] = useState(user?.displayName || '');
  const [newPassword, setNewPassword] = useState('');
  const [uploading, setUploading] = useState(false);

  const handleSave = async () => {
    if (user && displayName !== user.displayName) {
      await updateProfile(user, { displayName });
      alert('Display name updated!');
    }
  };

  const handlePasswordChange = async () => {
    if (user && newPassword.length >= 6) {
      await updatePassword(user, newPassword);
      alert('Password updated!');
    }
  };

  const handleAvatarUpload = async (e: any) => {
    if (!user) return;

    const file = e.target.files[0];
    const storageRef = ref(storage, `avatars/${user.uid}`);
    setUploading(true);
    await uploadBytes(storageRef, file);
    const url = await getDownloadURL(storageRef);

    await updateProfile(user, { photoURL: url });
    alert('Avatar updated!');
    setUploading(false);
  };

  return (
    <div className="max-w-lg mx-auto py-10">
      <h1 className="text-3xl font-bold mb-6">Account Settings</h1>

      <div className="mb-4">
        <label className="font-semibold">Email:</label>
        <p>{user?.email}</p>
      </div>

      <div className="mb-4">
        <label className="font-semibold">Display Name:</label>
        <input
          className="border rounded w-full p-2"
          value={displayName}
          onChange={(e) => setDisplayName(e.target.value)}
        />
        <button onClick={handleSave} className="mt-2 bg-yellow-400 px-4 py-2 rounded">Save</button>
      </div>

      <div className="mb-4">
        <label className="font-semibold">Change Password:</label>
        <input
          type="password"
          className="border rounded w-full p-2"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
        />
        <button onClick={handlePasswordChange} className="mt-2 bg-yellow-400 px-4 py-2 rounded">Update Password</button>
      </div>

      <div className="mb-4">
        <label className="font-semibold">Profile Photo:</label>
        <input type="file" onChange={handleAvatarUpload} disabled={uploading} />
        {uploading && <p>Uploading...</p>}
        {user?.photoURL && <img src={user.photoURL} alt="avatar" className="mt-4 w-24 h-24 rounded-full" />}
      </div>
    </div>
  );
};

export default AccountPage;
