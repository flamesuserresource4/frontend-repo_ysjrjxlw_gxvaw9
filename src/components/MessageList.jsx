import React, { useEffect, useMemo, useRef } from 'react';

function stringToColor(str) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  const hue = Math.abs(hash) % 360;
  return `hsl(${hue} 70% 45%)`;
}

const Avatar = ({ name, src }) => {
  if (src) {
    return (
      <img
        src={src}
        alt={name}
        className="w-9 h-9 rounded-md object-cover"
      />
    );
  }
  const initials = name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();
  const bg = stringToColor(name || 'User');
  return (
    <div
      className="w-9 h-9 rounded-md flex items-center justify-center text-white text-xs font-semibold"
      style={{ backgroundColor: bg }}
    >
      {initials || 'U'}
    </div>
  );
};

const MessageItem = ({ message }) => {
  const time = new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  return (
    <div className="flex items-start gap-3 px-4 py-3 hover:bg-gray-50">
      <Avatar name={message.authorName} src={message.authorAvatar} />
      <div className="min-w-0 flex-1">
        <div className="flex items-baseline gap-2">
          <span className="font-medium text-gray-900 truncate">{message.authorName}</span>
          {message.channelName && (
            <span className="text-xs text-indigo-600 bg-indigo-50 px-1.5 py-0.5 rounded"># {message.channelName}</span>
          )}
          <span className="text-xs text-gray-500">{time}</span>
        </div>
        <p className="text-sm text-gray-800 whitespace-pre-wrap break-words">{message.content}</p>
      </div>
    </div>
  );
};

const MessageList = ({ messages }) => {
  const containerRef = useRef(null);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    el.scrollTop = el.scrollHeight;
  }, [messages.length]);

  return (
    <div ref={containerRef} className="flex-1 overflow-y-auto bg-white">
      {messages.length === 0 ? (
        <div className="h-full w-full flex items-center justify-center text-sm text-gray-500">
          No messages yet. Say hello!
        </div>
      ) : (
        <ul className="divide-y divide-gray-100">
          {messages.map((m) => (
            <li key={m.id}>
              <MessageItem message={m} />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default MessageList;
