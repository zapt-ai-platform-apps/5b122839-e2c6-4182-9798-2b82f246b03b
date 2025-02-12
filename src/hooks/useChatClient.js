import { useEffect, useState } from 'react';
import { StreamChat } from 'stream-chat';
import * as Sentry from '@sentry/browser';

export default function useChatClient(user) {
  const [chatClient, setChatClient] = useState(null);
  const [channel, setChannel] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let client;
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
        
        // Initialize StreamChat client using the public key
        client = StreamChat.getInstance(import.meta.env.VITE_PUBLIC_STREAM_KEY);
        await client.connectUser(
          { id: userId, email: user.email, name: user.email },
          token
        );
        // Create or retrieve the support channel
        const chatChannel = client.channel('support', channelId, {
          name: 'Customer Support Chat',
          members: [userId]
        });
        await chatChannel.watch();
        setChatClient(client);
        setChannel(chatChannel);
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
      if (client) {
        client.disconnectUser();
      }
    };
  }, [user]);

  return { chatClient, channel, loading, error };
}