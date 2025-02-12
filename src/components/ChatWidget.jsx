import React, { useState } from 'react';
import { Chat, Channel, Window, MessageList, MessageInput } from 'stream-chat-react';
import 'stream-chat-react/dist/css/index.css';
import useChatClient from '../hooks/useChatClient';

export default function ChatWidget({ user }) {
  const { chatClient, channel, loading, error } = useChatClient(user);
  const [open, setOpen] = useState(false);

  if (!user) return null;
  if (loading) return null;
  if (error) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50">
      {open && chatClient && channel ? (
        <div className="w-80 h-96 bg-white rounded-lg shadow-lg flex flex-col">
          <div className="bg-blue-600 text-white px-4 py-2 flex justify-between items-center rounded-t-lg">
            <span>Customer Support Chat</span>
            <button onClick={() => setOpen(false)} className="cursor-pointer">
              X
            </button>
          </div>
          <div className="flex-1 overflow-hidden">
            <Chat client={chatClient} theme="messaging light">
              <Channel channel={channel}>
                <Window>
                  <MessageList />
                  <MessageInput />
                </Window>
              </Channel>
            </Chat>
          </div>
        </div>
      ) : (
        <button
          onClick={() => setOpen(true)}
          className="bg-blue-600 text-white p-3 rounded-full shadow-lg cursor-pointer"
        >
          Chat
        </button>
      )}
    </div>
  );
}