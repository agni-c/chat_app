import React from 'react';
import ScrollableFeed from 'react-scrollable-feed';
import { isLastMessage, isSameSender, isSameUser } from './config/ChatLogics';
import { ChatState } from '../../context/ChatProvider';
import { Tooltip, Avatar } from '@chakra-ui/react';

const ScrollableChat = ({ messages }) => {
  const { user } = ChatState();

  return (
    <ScrollableFeed>
      {console.log({ messages })}
      {messages.map((message, index) => (
        <div
          key={message._id}
          style={{
            display: 'flex',
            justifyContent:
              message.sender._id === user._id ? 'flex-end' : 'flex-start',
          }}
        >
          {(isSameSender(messages, message, index, user._id) ||
            isLastMessage(messages, index, user._id)) && (
            <Tooltip
              label={message.sender.name}
              hasArrow
              placement="bottom-start"
            >
              <Avatar
                mt="7px"
                mr={1}
                size="sm"
                cursor={'pointer'}
                name={message.sender.name}
                src={message.sender.pic}
              ></Avatar>
            </Tooltip>
          )}
          <span
            style={{
              backgroundColor: `${
                message.sender._id === user._id ? '#BEE3F8' : '#B9F5D0'
              }`,
              borderRadius: '20px',
              padding: '5px 15px',
              maxWidth: '75%',
              marginBottom: '5px',
              marginTop: isSameUser(messages, index, user._id) ? '0px' : '10px',
            }}
          >
            {' '}
            {message.content}
          </span>
        </div>
      ))}
    </ScrollableFeed>
  );
};

export default ScrollableChat;
