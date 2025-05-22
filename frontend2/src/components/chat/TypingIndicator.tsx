
import React from 'react';
import { motion } from 'framer-motion';

const TypingIndicator: React.FC = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex items-start max-w-[80%]"
    >
      <div className="relative bg-white/10 backdrop-blur-md border border-white/10 p-4 rounded-tr-2xl rounded-tl-sm rounded-br-2xl rounded-bl-2xl shadow-xl">
        <div className="flex space-x-2">
          <motion.div
            initial={{ scale: 0.8 }}
            animate={{ scale: [0.8, 1.2, 0.8] }}
            transition={{ repeat: Infinity, duration: 1.5, delay: 0 }}
            className="w-2 h-2 rounded-full bg-primary"
          />
          <motion.div
            initial={{ scale: 0.8 }}
            animate={{ scale: [0.8, 1.2, 0.8] }}
            transition={{ repeat: Infinity, duration: 1.5, delay: 0.2 }}
            className="w-2 h-2 rounded-full bg-violet-500"
          />
          <motion.div
            initial={{ scale: 0.8 }}
            animate={{ scale: [0.8, 1.2, 0.8] }}
            transition={{ repeat: Infinity, duration: 1.5, delay: 0.4 }}
            className="w-2 h-2 rounded-full bg-violet-400"
          />
        </div>
      </div>
    </motion.div>
  );
};

export default TypingIndicator;
