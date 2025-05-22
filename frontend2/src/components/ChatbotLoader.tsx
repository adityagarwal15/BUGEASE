
import React, { useState, useEffect } from 'react';
import ChatWindow from './chat/ChatWindow';
import { useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { MessageCircle } from 'lucide-react';

// Configure which paths should NOT show the chatbot
const excludedPaths = [
  '/login',
  '/signup',
  // Add other paths where you don't want the chatbot to appear
];

const ChatbotLoader: React.FC = () => {
  const { pathname } = useLocation();
  const [isChatVisible, setIsChatVisible] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);
  
  useEffect(() => {
    // Add a slight delay to ensure smooth page transitions before showing the chat
    const timer = setTimeout(() => {
      setIsChatVisible(true);
    }, 1000);
    
    return () => clearTimeout(timer);
  }, []);
  
  // Don't render the chatbot on excluded paths
  if (excludedPaths.includes(pathname) || !isChatVisible) {
    return null;
  }
  
  return (
    <div className="fixed bottom-6 right-6 z-50 animate-fade-in">
      {isChatOpen ? (
        <ChatWindow onClose={() => setIsChatOpen(false)} />
      ) : (
        <Button
          onClick={() => setIsChatOpen(true)}
          className="h-14 w-14 rounded-full bg-gradient-to-r from-[#7f5af0] to-[#00d1ff] hover:opacity-90 transition-all duration-300 shadow-[0_0_20px_rgba(127,90,240,0.5)] p-0 flex items-center justify-center"
          aria-label="Open chat assistant"
        >
          <MessageCircle className="h-6 w-6 text-white" />
        </Button>
      )}
    </div>
  );
};

export default ChatbotLoader;
