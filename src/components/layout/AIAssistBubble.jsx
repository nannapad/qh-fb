import React from 'react';
import { FiMessageCircle } from 'react-icons/fi';

const AIAssistBubble = () => {
  const handleClick = () => {
    alert('AI Assistant feature coming soon!');
  };

  return (
    <button
      onClick={handleClick}
      className="fixed bottom-6 right-6 bg-primary-600 hover:bg-primary-700 text-white p-4 rounded-full shadow-lg transition-colors duration-300 z-50"
      aria-label="AI Assistant"
    >
      <FiMessageCircle size={24} />
    </button>
  );
};

export default AIAssistBubble;