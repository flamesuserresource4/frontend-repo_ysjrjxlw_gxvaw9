import React, { useEffect, useRef, useState } from 'react';
import { User } from 'lucide-react';

const ProfileEditor = ({ profile, onChange }) => {
  const [name, setName] = useState(profile.name || '');
  const [avatar, setAvatar] = useState(profile.avatarUrl || '');
  const fileRef = useRef(null);

  useEffect(() => {
    setName(profile.name || '');
    setAvatar(profile.avatarUrl || '');
  }, [profile]);

  const handleFile = async (file) => {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const dataUrl = reader.result;
      setAvatar(dataUrl);
      onChange({ name, avatarUrl: dataUrl });
    };
    reader.readAsDataURL(file);
  };

  const saveName = () => {
    onChange({ name, avatarUrl: avatar });
  };

  return (
    <div className="h-full flex flex-col items-center justify-center px-6">
      <div className="w-full max-w-md bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
        <h3 className="text-lg font-semibold mb-4">Edit profile</h3>
        <div className="flex items-center gap-4 mb-6">
          {avatar ? (
            <img src={avatar} alt="avatar" className="w-16 h-16 rounded-lg object-cover" />
          ) : (
            <div className="w-16 h-16 rounded-lg bg-gray-100 flex items-center justify-center text-gray-400">
              <User />
            </div>
          )}
          <div>
            <button
              onClick={() => fileRef.current?.click()}
              className="px-3 py-1.5 text-sm rounded-md bg-gray-100 hover:bg-gray-200"
            >
              Upload photo
            </button>
            <input
              ref={fileRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => handleFile(e.target.files?.[0])}
            />
          </div>
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">Display name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            onBlur={saveName}
            placeholder="Your name"
            className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>
      </div>
    </div>
  );
};

export default ProfileEditor;
