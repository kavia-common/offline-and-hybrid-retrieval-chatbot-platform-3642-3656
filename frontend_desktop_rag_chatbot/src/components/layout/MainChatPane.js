import React, { useCallback, useMemo, useRef, useState } from 'react';
import ChatMessageList from '../chat/ChatMessageList';
import ChatComposer from '../chat/ChatComposer';
import ChatStatusBar from '../chat/ChatStatusBar';
import { sendUserMessage, streamAssistantReply } from '../../services/chatService';

// PUBLIC_INTERFACE
export default function MainChatPane() {
  /**
   * Main chat pane integrating message list, composer, and status bar.
   * Manages streaming mock state until IPC is wired.
   */
  const [messages, setMessages] = useState(() => [
    {
      id: 'sys-1',
      role: 'system',
      text: 'You are an Ocean Professional assistant. Keep answers concise and helpful.',
      createdAt: Date.now(),
    },
  ]);
  const [isStreaming, setIsStreaming] = useState(false);
  const [pendingAssistant, setPendingAssistant] = useState('');
  const [tokensUsed] = useState(null);
  const [latencyMs] = useState(null);

  // Keep a counter for ids
  const idRef = useRef(1);
  const nextId = () => {
    idRef.current += 1;
    return String(idRef.current);
  };

  const handleSend = useCallback(async (text) => {
    const ts = Date.now();
    const userMsg = { id: `u-${nextId()}`, role: 'user', text, createdAt: ts };
    setMessages((prev) => [...prev, userMsg]);
    setPendingAssistant('');
    setIsStreaming(true);

    try {
      await sendUserMessage(text); // placeholder
      const start = Date.now();
      await streamAssistantReply((chunk) => {
        setPendingAssistant((prev) => (prev || '') + chunk);
      });
      const end = Date.now();
      // finalize assistant message
      const finalText = (pendingAssistantRef.current || '') + ''; // ensure final read
      const finalMsg = {
        id: `a-${nextId()}`,
        role: 'assistant',
        text: finalText,
        createdAt: end,
      };
      setMessages((prev) => [...prev, finalMsg]);
    } catch {
      const errMsg = {
        id: `a-${nextId()}`,
        role: 'assistant',
        text: 'Sorry, something went wrong while generating a reply.',
        createdAt: Date.now(),
      };
      setMessages((prev) => [...prev, errMsg]);
    } finally {
      setPendingAssistant('');
      setIsStreaming(false);
    }
  }, []);

  // Ref to access latest pending text when finalizing
  const pendingAssistantRef = useRef('');
  pendingAssistantRef.current = pendingAssistant;

  const showEmpty = useMemo(() => {
    const realMessages = messages.filter((m) => m.role !== 'system');
    return realMessages.length === 0 && !pendingAssistant;
  }, [messages, pendingAssistant]);

  return (
    <section className="main-chat-pane" aria-label="Main chat area">
      <div className="chat-header">
        <h2 className="m-0">Conversation</h2>
        <p className="muted">Ask questions about your documents. Streaming is mocked for now.</p>
      </div>

      {showEmpty ? (
        <div className="chat-body surface">
          <div className="empty-state">
            <h3>Welcome</h3>
            <p className="muted">Start by asking a question. Use the sidebar to connect sources.</p>
          </div>
        </div>
      ) : (
        <ChatMessageList
          messages={messages}
          isStreaming={isStreaming}
          pendingText={pendingAssistant}
        />
      )}

      <ChatStatusBar isStreaming={isStreaming} tokensUsed={tokensUsed} latencyMs={latencyMs} />

      <ChatComposer onSend={handleSend} disabled={isStreaming} />
    </section>
  );
}
