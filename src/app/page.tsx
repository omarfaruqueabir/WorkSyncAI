'use client';

import { useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import ChatMessage from '@/components/ChatMessage';
import ChatInput from '@/components/ChatInput';
import ChatSidebar from '@/components/ChatSidebar';
import { Message } from '@/types/chat';
import ActivityFeed from '@/components/ActivityFeed';

interface Conversation {
  id: string;
  messages: Message[];
  timestamp: Date;
}

export default function Home() {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeConversationId, setActiveConversationId] = useState<string | null>(null);
  const [currentMessages, setCurrentMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Load conversations from localStorage on initial render
  useEffect(() => {
    const savedConversations = localStorage.getItem('conversations');
    if (savedConversations) {
      const parsed = JSON.parse(savedConversations);
      setConversations(parsed.map((conv: any) => ({
        ...conv,
        timestamp: new Date(conv.timestamp)
      })));
    }
  }, []);

  // Save conversations to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('conversations', JSON.stringify(conversations));
  }, [conversations]);

  // Handle new chat button click
  const handleNewChat = () => {
    setActiveConversationId(null);
    setCurrentMessages([]);
  };

  const handleSendMessage = async (content: string) => {
    const userMessage: Message = {
      id: uuidv4(),
      content,
      role: 'user',
      timestamp: new Date(),
    };

    // Create a temporary loading message
    const loadingMessage: Message = {
      id: uuidv4(),
      content: '',
      role: 'assistant',
      timestamp: new Date(),
    };

    const newMessages = [...currentMessages, userMessage, loadingMessage];
    setCurrentMessages(newMessages);

    // If this is the first message, create a new conversation
    if (!activeConversationId) {
      const newId = uuidv4();
      setActiveConversationId(newId);
      setConversations(prev => [{
        id: newId,
        messages: newMessages,
        timestamp: new Date()
      }, ...prev]);
    } else {
      // Update existing conversation
      setConversations(prev => prev.map(conv =>
        conv.id === activeConversationId
          ? { 
              ...conv, 
              messages: newMessages,
              timestamp: new Date()
            }
          : conv
      ));
    }

    setIsLoading(true);

    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const mockResponse = {
        content: "This is a mock response. Please replace with actual API integration.",
      };

      // Replace loading message with actual response
      const updatedMessages = newMessages.map(msg => 
        msg.id === loadingMessage.id
          ? {
              ...msg,
              content: mockResponse.content,
            }
          : msg
      );

      setCurrentMessages(updatedMessages);

      // Update conversation with assistant's response
      setConversations(prev => prev.map(conv =>
        conv.id === activeConversationId
          ? {
              ...conv,
              messages: updatedMessages,
              timestamp: new Date()
            }
          : conv
      ));
    } catch (error) {
      console.error('Error:', error);
      // Remove loading message on error
      const messagesWithoutLoading = newMessages.filter(msg => msg.id !== loadingMessage.id);
      setCurrentMessages(messagesWithoutLoading);
      setConversations(prev => prev.map(conv =>
        conv.id === activeConversationId
          ? {
              ...conv,
              messages: messagesWithoutLoading,
              timestamp: new Date()
            }
          : conv
      ));
    } finally {
      setIsLoading(false);
    }
  };

  // Handle selecting a conversation
  const handleSelectConversation = (id: string) => {
    setActiveConversationId(id);
    const conversation = conversations.find(c => c.id === id);
    setCurrentMessages(conversation?.messages || []);
  };

  // Handle deleting a conversation
  const handleDeleteChat = (id: string) => {
    setConversations(prev => prev.filter(conv => conv.id !== id));
    if (activeConversationId === id) {
      setActiveConversationId(null);
      setCurrentMessages([]);
    }
  };

  return (
    <div className="flex h-screen overflow-hidden">
      <div className="w-64 h-full bg-sidebar-bg">
        <ChatSidebar
          conversations={conversations.map(conv => ({
            id: conv.id,
            preview: conv.messages[0]?.content || 'New Chat',
            timestamp: conv.timestamp
          }))}
          activeId={activeConversationId || ''}
          onSelect={handleSelectConversation}
          onNew={handleNewChat}
          onDelete={handleDeleteChat}
        />
      </div>
      <main className="flex-1 relative bg-chat-bg">
        <div className="absolute inset-0 overflow-y-auto">
          <div className="pb-32">
            {currentMessages.map((message: Message) => (
              <ChatMessage 
                key={message.id} 
                message={message} 
                isLoading={isLoading && message.role === 'assistant' && !message.content}
              />
            ))}
            {currentMessages.length === 0 && (
              <div className="h-[calc(100vh-128px)] flex items-center justify-center">
                <p className="text-gray-400 text-center">
                  Start a conversation by typing a message below.
                </p>
              </div>
            )}
          </div>
        </div>
        <ChatInput onSendMessage={handleSendMessage} disabled={isLoading} />
      </main>
      <ActivityFeed />
    </div>
  );
} 