
import React from 'react';
import { motion } from 'framer-motion';
import { MapPin, Car, Clock, Route } from 'lucide-react';
import { QuickReply } from './ChatWindow';

interface QuickReplyButtonsProps {
  quickReplies: QuickReply[];
  onSelectReply?: (action: string, text: string) => void;
}

const QuickReplyButtons: React.FC<QuickReplyButtonsProps> = ({ 
  quickReplies, 
  onSelectReply 
}) => {
  const getIcon = (iconName?: string) => {
    switch (iconName) {
      case 'map-pin':
        return <MapPin className="h-4 w-4" />;
      case 'car':
        return <Car className="h-4 w-4" />;
      case 'clock':
        return <Clock className="h-4 w-4" />;
      case 'route':
        return <Route className="h-4 w-4" />;
      default:
        return null;
    }
  };

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };
  
  const item = {
    hidden: { opacity: 0, scale: 0.8 },
    show: { opacity: 1, scale: 1 }
  };

  return (
    <motion.div 
      className="flex flex-wrap gap-2"
      variants={container}
      initial="hidden"
      animate="show"
    >
      {quickReplies.map((reply) => (
        <motion.button
          key={reply.id}
          variants={item}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="relative group"
          onClick={() => onSelectReply && onSelectReply(reply.action, reply.text)}
        >
          <div className="absolute inset-0 rounded-full bg-gradient-to-br from-primary/40 to-violet-600/40 blur-sm group-hover:opacity-100 opacity-0 transition-opacity"></div>
          <div className="relative bg-white/10 backdrop-blur-sm hover:bg-white/20 inline-flex items-center gap-1.5 px-4 py-2 rounded-full transition-colors border border-white/10 shadow-lg z-10">
            {reply.icon && getIcon(reply.icon)}
            <span className="text-sm text-white">{reply.text}</span>
          </div>
        </motion.button>
      ))}
    </motion.div>
  );
};

export default QuickReplyButtons;
