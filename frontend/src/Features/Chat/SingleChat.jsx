import React from 'react';
import { ChatState } from '../../context/ChatProvider';
import { Box, Text, Spinner, FormControl } from '@chakra-ui/react';
import { IconButton, Input, useToast } from '@chakra-ui/react';
import { ArrowBackIcon } from '@chakra-ui/icons';
import { getSender, getSenderName } from '../Chat/config/ChatLogics';
import ProfileModal from '../UserAvatar/ProfileModal';
import UpdateGroupChatModal from './UpdateGroupChatModal';
import { useState } from 'react';
import { set } from 'mongoose';
import axios from 'axios';
import { useEffect } from 'react';
import ScrollableChat from './ScrollableChat';

const SingleChat = ({ fetchAgain, setFetchAgain }) => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const { selectedChat, setSelectedChat, user, chats, setChats } = ChatState();
  const toast = useToast();

  const sendMessage = async (e) => {
    if (e.key === 'Enter') {
      if (newMessage.trim() === '') return;

      try {
        const config = {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${user.token}`,
          },
        };

        setNewMessage('');

        const { data } = await axios.post(
          '/api/message',
          {
            content: newMessage,
            chatId: selectedChat._id,
          },
          config
        );
        setMessages([...messages, data]);
      } catch (error) {
        console.log({ error });
        toast({
          title: 'An error occurred.',
          description: error.response,
          status: 'error',
          duration: 9000,
          isClosable: true,
        });
      }

      setNewMessage('');
    }
  };
  const typingHandler = (e) => {
    setNewMessage(e.target.value);
    // TODO typing indecator logic
  };
  const fetchMessages = async () => {
    if (!selectedChat) return;
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };
      setLoading(true);
      const { data } = await axios.get(
        `/api/message/${selectedChat._id}`,
        config
      );
      setMessages(data);
      setLoading(false);
      console.log({ messages });
    } catch (error) {
      toast({
        title: 'An error occurred.',
        description: error.response,
        status: 'error',
        duration: 9000,
        isClosable: true,
      });
    }
  };

  useEffect(() => {
    fetchMessages();
  }, [selectedChat]);
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
                    setMessages={setMessages}
                  />
                </>
              )}
            </Text>

            {/* chatbox */}

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

              {loading ? (
                <Spinner
                  alignSelf={'center'}
                  height={'20'}
                  width={'20'}
                  margin={'auto'}
                />
              ) : (
                <div className="messages">
                  <ScrollableChat messages={messages} />
                </div>
              )}

              {/* messages */}
              <FormControl onKeyDown={sendMessage} isRequired mt={3}>
                <Input
                  variant={'filled'}
                  bg={'#E0E0E0'}
                  placeholder="Enter a message..."
                  value={newMessage}
                  onChange={typingHandler}
                />
              </FormControl>
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
