import React from 'react';
import { Fab } from '@mui/material';
import ChatIcon from '@mui/icons-material/Chat';

const ChatbotButton: React.FC = () => {
  const openChatbot = () => {
    if (window.botpressWebChat) {
      window.botpressWebChat.sendEvent({ type: 'show' });
    }
  };

  return (
    <Fab
      color="primary"
      aria-label="chat"
      onClick={openChatbot}
    >
      <ChatIcon />
    </Fab>
  );
};

export default ChatbotButton;