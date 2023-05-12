import React from 'react';
import ScrollableFeed from 'react-scrollable-feed';
import { isSameSender } from './config/ChatLogics';
import { ChatState } from '../../context/ChatProvider';

const ScrollableChat = ({ messages }) => {
  const { user } = ChatState();
  return (
    <ScrollableFeed>
      {messages.map((message, index) => (
        <div key={message._id}>{isSameSender(messages)}</div>
      ))}
    </ScrollableFeed>
  );
};

export default ScrollableChat;
