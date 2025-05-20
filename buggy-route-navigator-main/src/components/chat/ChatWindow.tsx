import React, { useState, useRef, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { MessageCircle, X, Send, Maximize, Minimize, Bot, Map } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import ChatMessage from './ChatMessage';
import QuickReplyButtons from './QuickReplyButtons';
import TypingIndicator from './TypingIndicator';
import { useChatSocket } from '@/hooks/useChatSocket';
import { useGeminiAPI } from '@/hooks/useGeminiAPI';
import { Sheet, SheetContent } from '@/components/ui/sheet';
import { playNotificationSound } from '@/utils/soundNotification';

export interface Message {
  id: string;
  content: string;
  sender: 'user' | 'bot';
  timestamp: Date;
  quickReplies?: QuickReply[];
}

export interface QuickReply {
  id: string;
  text: string;
  action: string;
  icon?: string;
}

const ChatWindow = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isBotTyping, setIsBotTyping] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();
  const { sendMessage, lastMessage } = useChatSocket();
  const { generateResponse, isLoading } = useGeminiAPI();
  
  useEffect(() => {
    if (isOpen && messages.length === 0) {
      // Add welcome message when chat is first opened
      const welcomeMessage: Message = {
        id: Date.now().toString(),
        content: "👋 Hi there! I'm your Campus Buggy Assistant. How can I help you today?",
        sender: 'bot',
        timestamp: new Date(),
        quickReplies: [
          { id: '1', text: 'Show nearest buggy', action: 'nearest_buggy', icon: 'map-pin' },
          { id: '2', text: 'Book a ride', action: 'book_ride', icon: 'car' },
          { id: '3', text: 'Trip history', action: 'trip_history', icon: 'clock' },
          { id: '4', text: 'Optimized route', action: 'optimize_route', icon: 'route' }
        ]
      };
      setMessages([welcomeMessage]);
    }
  }, [isOpen, messages.length]);
  
  // Scroll to bottom of messages when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);
  
  // Process incoming WebSocket messages
  useEffect(() => {
    if (lastMessage && typeof lastMessage === 'object') {
      try {
        const messageData = JSON.parse(JSON.stringify(lastMessage));
        
        if (messageData.type === 'bot_message') {
          setIsBotTyping(false);
          addMessage({
            content: messageData.content,
            sender: 'bot',
            quickReplies: messageData.quick_replies
          });
          
          // Play sound if chat window is minimized
          if (!isOpen || isMinimized) {
            playNotificationSound();
          }
        } else if (messageData.type === 'typing_indicator') {
          setIsBotTyping(messageData.is_typing);
        }
      } catch (error) {
        console.error('Error processing WebSocket message:', error);
      }
    }
  }, [lastMessage, isOpen, isMinimized]);
  
  const addMessage = ({ content, sender, quickReplies }: 
    { content: string, sender: 'user' | 'bot', quickReplies?: QuickReply[] }) => {
    const newMessage: Message = {
      id: Date.now().toString(),
      content,
      sender,
      timestamp: new Date(),
      quickReplies
    };
    
    setMessages(prev => [...prev, newMessage]);
  };
  
  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;
    
    const userMessage = inputValue.trim();
    setInputValue('');
    
    // Add user message to chat
    addMessage({ content: userMessage, sender: 'user' });
    
    // Show bot typing indicator
    setIsBotTyping(true);
    
    try {
      // Send message to WebSocket for backend processing
      sendMessage({
        type: 'user_message',
        content: userMessage,
      });
      
      // Generate response using Gemini API
      const response = await generateResponse(userMessage);
      
      // Response is handled by the WebSocket callback
    } catch (error) {
      console.error('Error sending message:', error);
      setIsBotTyping(false);
      
      toast({
        title: "Error",
        description: "Failed to send message. Please try again.",
        variant: "destructive"
      });
    }
  };
  
  const handleQuickReplyClick = async (action: string, text: string) => {
    addMessage({ content: text, sender: 'user' });
    setIsBotTyping(true);
    
    try {
      // Send action to WebSocket
      sendMessage({
        type: 'quick_reply',
        action: action,
        content: text,
      });
      
      // Actions are handled by the WebSocket callback
    } catch (error) {
      console.error('Error with quick reply:', error);
      setIsBotTyping(false);
      
      toast({
        title: "Error",
        description: "Failed to process your request. Please try again.",
        variant: "destructive"
      });
    }
  };

  const toggleChat = () => {
    setIsOpen(!isOpen);
  };
  
  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };
  
  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };
  
  return (
    <>
      {/* Chat toggle button */}
      <motion.button
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        onClick={toggleChat}
        className={`fixed ${isOpen ? 'hidden' : 'flex'} bottom-6 right-6 z-50 p-4 rounded-full shadow-lg bg-gradient-to-r from-primary to-violet-600 text-white items-center justify-center group`}
      >
        <div className="absolute inset-0 rounded-full bg-white/10 blur opacity-0 group-hover:opacity-100 transition-opacity"></div>
        <MessageCircle className="h-6 w-6 relative z-10" />
      </motion.button>
      
      {/* Chat window */}
      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetContent 
          side="right" 
          className={`p-0 border-none overflow-hidden ${isFullscreen ? 'w-full h-full' : 'w-[90%] max-w-[400px] sm:w-[400px] h-[600px] max-h-[80vh]'} rounded-xl bg-gradient-to-br from-slate-950/90 to-slate-900/90 shadow-2xl backdrop-blur-xl border border-white/10`}
        >
          {/* Chat header */}
          <div className="flex items-center justify-between p-4 border-b border-white/10 bg-black/30 backdrop-blur-md">
            <div className="flex items-center">
              <div className="relative">
                <div className="absolute inset-0 rounded-full bg-primary/30 blur-sm animate-pulse-slow"></div>
                <div className="bg-gradient-to-br from-violet-600 to-primary p-2 rounded-full relative z-10">
                  <Bot className="h-5 w-5 text-white" />
                </div>
              </div>
              <div className="ml-3">
                <h3 className="font-medium text-lg bg-gradient-to-r from-white to-slate-300 bg-clip-text text-transparent">Campus Buggy AI</h3>
                <p className="text-xs text-slate-400">Powered by Gemini</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <button 
                onClick={toggleFullscreen} 
                className="p-2 rounded-md hover:bg-white/10 transition-colors text-slate-300"
              >
                {isFullscreen ? <Minimize className="h-4 w-4" /> : <Maximize className="h-4 w-4" />}
              </button>
              <button 
                onClick={() => setIsOpen(false)} 
                className="p-2 rounded-md hover:bg-white/10 transition-colors text-slate-300"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>
          
          {/* Chat messages */}
          <div className="flex flex-col h-full">
            <div 
              className="flex-grow overflow-y-auto p-4 space-y-4"
              style={{
                backgroundImage: 'radial-gradient(circle at center, rgba(139, 92, 246, 0.12) 0%, transparent 70%)',
                backgroundSize: '100% 100%',
                backgroundPosition: 'center'
              }}
            >
              <AnimatePresence initial={false}>
                {messages.map((message) => (
                  <ChatMessage key={message.id} message={message} />
                ))}
              </AnimatePresence>
              
              {isBotTyping && <TypingIndicator />}
              
              {/* Invisible element to scroll to */}
              <div ref={messagesEndRef} />
            </div>
            
            {/* Chat input */}
            <div className="border-t border-white/10 p-4 bg-black/30 backdrop-blur-md">
              <div className="flex items-center space-x-2">
                <div className="relative w-full">
                  <input
                    type="text"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Type your message..."
                    className="w-full rounded-lg bg-white/5 border border-white/10 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary/50 text-white placeholder:text-slate-400"
                    disabled={isBotTyping}
                  />
                  <div className="absolute inset-0 rounded-lg -z-10 bg-gradient-to-r from-primary/10 to-violet-600/10 blur-sm"></div>
                </div>
                <button
                  onClick={handleSendMessage}
                  disabled={!inputValue.trim() || isBotTyping}
                  className="p-3 rounded-lg bg-gradient-to-r from-primary to-violet-600 text-white hover:shadow-lg hover:shadow-primary/20 disabled:opacity-50 transition-all"
                >
                  <Send className="h-5 w-5" />
                </button>
              </div>
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </>
  );
};

export default ChatWindow;
