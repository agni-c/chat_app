import React from 'react';
import { ChatState } from '../../context/ChatProvider';
import { Box, Text } from '@chakra-ui/react';
import { IconButton } from '@chakra-ui/react';
import { ArrowBackIcon } from '@chakra-ui/icons';
import { getSender, getSenderName } from '../Chat/config/ChatLogics';
import ProfileModal from '../UserAvatar/ProfileModal';
import UpdateGroupChatModal from './UpdateGroupChatModal';
import { useState } from 'react';

const SingleChat = ({ fetchAgain, setFetchAgain }) => {
  const [messages, setMessages] = useState([]);
  const { selectedChat, setSelectedChat, user, chats, setChats } = ChatState();
  return (
    <>
      <Box
        display="flex"
        flexDir="column"
        alignItems="center"
        justifyContent={'center'}
        h={'100%'}
        bg="white"
        w="100%"
        borderRadius="lg"
      >
        {selectedChat ? (
          <>
            <Text
              fontSize={{ base: '28px', md: '30px' }}
              pb={3}
              px={2}
              w="100%"
              fontFamily="Work sans"
              display="flex"
              justifyContent={{ base: 'space-between' }}
              alignItems="center"
            >
              <IconButton
                display={{ base: 'flex', md: 'none' }}
                icon={<ArrowBackIcon />}
                onClick={() => setSelectedChat('')}
              />
              {!selectedChat.isGroupChat ? (
                <>
                  {getSenderName(user, selectedChat.users)}
                  <ProfileModal user={getSender(user, selectedChat.users)} />
                </>
              ) : (
                <>
                  {selectedChat.chatName.toUpperCase()}
                  <UpdateGroupChatModal
                    fetchAgain={fetchAgain}
                    setFetchAgain={setFetchAgain}
                  />
                </>
              )}
            </Text>

            <Box
              display="flex"
              flexDir="column"
              justifyContent="flex-end"
              p={3}
              bg="#E8E8E8"
              w="97%"
              h="90%"
              borderRadius="lg"
              overflowY="hidden"
            >
              {/* Messages */}
            </Box>
          </>
        ) : (
          <Text fontSize={'3xl'} pb={3} color="grey" fontFamily="Work sans">
            Click on a user to start chatting
          </Text>
        )}
      </Box>
    </>
  );
};

export default SingleChat;
