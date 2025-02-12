import { useEffect, useState } from 'react';
import { StreamChat } from 'stream-chat';
import * as Sentry from '@sentry/browser';

export default function useChatClient(user) {
  const [chatClient, setChatClient] = useState(null);
  const [channel, setChannel] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function initChat() {
      if (!user) {
        setLoading(false);
        return;
      }
      try {
        // Fetch support chat credentials from the backend API
        const response = await fetch('/api/customerSupport', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ email: user.email })
        });
        if (!response.ok) {
          throw new Error('Failed to connect to support chat service');
        }

        const { token, channelId, userId } = await response.json();
        const streamClient = StreamChat.getInstance(import.meta.env.VITE_PUBLIC_STREAM_KEY);
        await streamClient.connectUser(
          { id: userId, name: user.email },
          token
        );
        const streamChannel = streamClient.channel('messaging', channelId);
        await streamChannel.watch();
        setChatClient(streamClient);
        setChannel(streamChannel);
      } catch (err) {
        Sentry.captureException(err);
        console.error('Chat initialization error:', err);
        setError(err);
      } finally {
        setLoading(false);
      }
    }
    initChat();
    return () => {
      if (chatClient) {
        chatClient.disconnectUser();
      }
    };
  }, [user]);

  return { chatClient, channel, loading, error };
}