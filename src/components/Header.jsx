import React from 'react';
import { Search, Settings } from 'lucide-react';

const Header = ({ search, setSearch, activeTab, setActiveTab, currentChannelName }) => {
  return (
    <header className="w-full border-b border-gray-200 bg-white">
      <div className="px-4 py-3 flex items-center gap-4">
        <div className="flex-1 max-w-xl relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search all messages..."
            className="w-full rounded-md border border-gray-300 pl-9 pr-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveTab('chat')}
            className={`px-3 py-1.5 text-sm rounded-md ${
              activeTab === 'chat' ? 'bg-indigo-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            {currentChannelName ? `# ${currentChannelName}` : 'Chat'}
          </button>
          <button
            onClick={() => setActiveTab('profile')}
            className={`px-3 py-1.5 text-sm rounded-md inline-flex items-center gap-1 ${
              activeTab === 'profile' ? 'bg-indigo-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            <Settings size={16} /> Edit profile
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
