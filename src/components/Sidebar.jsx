import React, { useState } from 'react';
import { Plus } from 'lucide-react';

const Sidebar = ({ channels, currentChannelId, onSelectChannel, onCreateChannel }) => {
  const [newChannelName, setNewChannelName] = useState('');

  const handleCreate = () => {
    const name = newChannelName.trim();
    if (!name) return;
    onCreateChannel(name);
    setNewChannelName('');
  };

  return (
    <aside className="h-full w-72 border-r border-gray-200 bg-white flex flex-col">
      <div className="p-4 border-b border-gray-200 flex items-center justify-between">
        <h2 className="text-lg font-semibold">Channels</h2>
      </div>
      <div className="p-3 flex items-center gap-2">
        <input
          type="text"
          value={newChannelName}
          onChange={(e) => setNewChannelName(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') handleCreate();
          }}
          placeholder="New channel name"
          className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
        <button
          onClick={handleCreate}
          className="inline-flex items-center justify-center rounded-md bg-indigo-600 text-white p-2 hover:bg-indigo-700"
          aria-label="Create channel"
        >
          <Plus size={18} />
        </button>
      </div>
      <nav className="flex-1 overflow-y-auto">
        {channels.length === 0 ? (
          <p className="text-sm text-gray-500 px-4 py-2">No channels yet. Create one to start chatting.</p>
        ) : (
          <ul className="py-2">
            {channels.map((ch) => (
              <li key={ch.id}>
                <button
                  onClick={() => onSelectChannel(ch.id)}
                  className={`w-full text-left px-4 py-2 text-sm hover:bg-indigo-50 ${
                    currentChannelId === ch.id ? 'bg-indigo-50 text-indigo-700 font-medium' : 'text-gray-700'
                  }`}
                >
                  # {ch.name}
                </button>
              </li>
            ))}
          </ul>
        )}
      </nav>
    </aside>
  );
};

export default Sidebar;
