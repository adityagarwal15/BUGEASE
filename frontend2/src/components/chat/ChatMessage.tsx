
import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { format } from 'date-fns';
import QuickReplyButtons from './QuickReplyButtons';
import { Message } from './ChatWindow';

interface ChatMessageProps {
  message: Message;
}

const ChatMessage: React.FC<ChatMessageProps> = ({ message }) => {
  const [displayText, setDisplayText] = useState('');
  const [showFullText, setShowFullText] = useState(false);
  const [isTypingComplete, setIsTypingComplete] = useState(false);
  const typingSpeed = 25; // ms per character
  
  useEffect(() => {
    if (message.sender === 'bot' && !showFullText) {
      let index = 0;
      setDisplayText('');
      
      const interval = setInterval(() => {
        setDisplayText(message.content.substring(0, index + 1));
        index++;
        
        if (index >= message.content.length) {
          clearInterval(interval);
          setIsTypingComplete(true);
        }
      }, typingSpeed);
      
      return () => clearInterval(interval);
    } else {
      setDisplayText(message.content);
      setIsTypingComplete(true);
    }
  }, [message.content, message.sender, showFullText]);
  
  const skipAnimation = () => {
    if (message.sender === 'bot' && !isTypingComplete) {
      setShowFullText(true);
      setDisplayText(message.content);
      setIsTypingComplete(true);
    }
  };
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.2 }}
      className={`flex flex-col ${message.sender === 'user' ? 'items-end' : 'items-start'}`}
    >
      <div 
        className={`relative max-w-[80%] ${
          message.sender === 'user' 
            ? 'bg-gradient-to-br from-primary to-violet-600 text-white rounded-tl-2xl rounded-tr-sm rounded-bl-2xl rounded-br-2xl' 
            : 'bg-white/10 backdrop-blur-md border border-white/10 text-white rounded-tr-2xl rounded-tl-sm rounded-br-2xl rounded-bl-2xl shadow-xl'
        } p-4`}
        onClick={skipAnimation}
      >
        <div className="whitespace-pre-wrap">{displayText}</div>
      </div>
      
      <div className="text-xs text-slate-400 mt-1 px-1">
        {format(new Date(message.timestamp), 'h:mm a')}
      </div>
      
      {message.sender === 'bot' && message.quickReplies && isTypingComplete && (
        <div className="mt-2 ml-2">
          <QuickReplyButtons quickReplies={message.quickReplies} />
        </div>
      )}
    </motion.div>
  );
};

export default ChatMessage;
