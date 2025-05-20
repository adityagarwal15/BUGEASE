
import React from 'react';
import ChatWindow from './chat/ChatWindow';
import { useLocation } from 'react-router-dom';

// Configure which paths should NOT show the chatbot
const excludedPaths = [
  '/login',
  '/signup',
  '/admin-auth',
  // Add other paths where you don't want the chatbot to appear
];

const ChatbotLoader: React.FC = () => {
  const { pathname } = useLocation();
  
  // Don't render the chatbot on excluded paths
  if (excludedPaths.includes(pathname)) {
    return null;
  }
  
  return <ChatWindow />;
};

export default ChatbotLoader;
