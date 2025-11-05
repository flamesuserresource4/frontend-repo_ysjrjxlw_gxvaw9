import React, { useEffect, useMemo, useState } from 'react';
import Sidebar from './components/Sidebar.jsx';
import Header from './components/Header.jsx';
import MessageList from './components/MessageList.jsx';
import MessageInput from './components/MessageInput.jsx';
import ProfileEditor from './components/ProfileEditor.jsx';

const uuid = () => Math.random().toString(36).slice(2) + Date.now().toString(36);

export default function App() {
  // Profile
  const [profile, setProfile] = useState({ name: 'You', avatarUrl: '' });

  // Channels and messages
  const [channels, setChannels] = useState([]);
  const [currentChannelId, setCurrentChannelId] = useState(null);
  const [messages, setMessages] = useState([]); // {id, channelId, authorName, authorAvatar, content, timestamp}

  // UI
  const [search, setSearch] = useState('');
  const [activeTab, setActiveTab] = useState('chat');

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const storedProfile = JSON.parse(localStorage.getItem('vc_profile') || 'null');
      if (storedProfile) setProfile(storedProfile);

      const storedChannels = JSON.parse(localStorage.getItem('vc_channels') || 'null');
      const storedMessages = JSON.parse(localStorage.getItem('vc_messages') || 'null');

      if (storedChannels && Array.isArray(storedChannels) && storedChannels.length) {
        setChannels(storedChannels);
        setCurrentChannelId(storedChannels[0]?.id || null);
      } else {
        const defaultChannel = { id: uuid(), name: 'general' };
        setChannels([defaultChannel]);
        setCurrentChannelId(defaultChannel.id);
      }

      if (storedMessages && Array.isArray(storedMessages)) setMessages(storedMessages);
    } catch (e) {
      // Fallback to defaults
      const defaultChannel = { id: uuid(), name: 'general' };
      setChannels([defaultChannel]);
      setCurrentChannelId(defaultChannel.id);
    }
  }, []);

  // Persist changes
  useEffect(() => {
    localStorage.setItem('vc_profile', JSON.stringify(profile));
  }, [profile]);

  useEffect(() => {
    localStorage.setItem('vc_channels', JSON.stringify(channels));
  }, [channels]);

  useEffect(() => {
    localStorage.setItem('vc_messages', JSON.stringify(messages));
  }, [messages]);

  const currentChannel = useMemo(
    () => channels.find((c) => c.id === currentChannelId) || null,
    [channels, currentChannelId]
  );

  const createChannel = (name) => {
    const newCh = { id: uuid(), name };
    setChannels((prev) => [newCh, ...prev]);
    setCurrentChannelId(newCh.id);
    setActiveTab('chat');
  };

  const sendMessage = (text) => {
    if (!currentChannelId) return;
    const msg = {
      id: uuid(),
      channelId: currentChannelId,
      authorName: profile.name || 'You',
      authorAvatar: profile.avatarUrl || '',
      content: text,
      timestamp: Date.now(),
    };
    setMessages((prev) => [...prev, msg]);
  };

  const handleProfileChange = (next) => {
    setProfile((prev) => ({ ...prev, ...next }));
  };

  // Filter messages for current view
  const visibleMessages = useMemo(() => {
    if (!search.trim()) {
      return messages
        .filter((m) => m.channelId === currentChannelId)
        .map((m) => ({ ...m }));
    }
    const q = search.toLowerCase();
    return messages
      .filter((m) => m.content.toLowerCase().includes(q) || (m.authorName || '').toLowerCase().includes(q))
      .map((m) => {
        const ch = channels.find((c) => c.id === m.channelId);
        return { ...m, channelName: ch?.name };
      });
  }, [messages, currentChannelId, search, channels]);

  return (
    <div className="h-screen w-screen overflow-hidden bg-gray-50 text-gray-900">
      <div className="h-full flex">
        {/* Sidebar */}
        <Sidebar
          channels={channels}
          currentChannelId={currentChannelId}
          onSelectChannel={(id) => {
            setCurrentChannelId(id);
            setActiveTab('chat');
          }}
          onCreateChannel={createChannel}
        />

        {/* Main area */}
        <div className="flex-1 flex flex-col min-w-0">
          <Header
            search={search}
            setSearch={setSearch}
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            currentChannelName={currentChannel?.name}
          />

          {/* Content area: only messages scroll */}
          <div className="flex-1 min-h-0 flex flex-col">
            {activeTab === 'profile' ? (
              <div className="flex-1 overflow-y-auto">
                <ProfileEditor profile={profile} onChange={handleProfileChange} />
              </div>
            ) : (
              <>
                <MessageList messages={visibleMessages} />
                <MessageInput onSend={sendMessage} />
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
