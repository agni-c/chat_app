import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { ChatState } from '../../context/ChatProvider';
import { Box, Text, Spinner, FormControl } from '@chakra-ui/react';
import { IconButton, Input, useToast } from '@chakra-ui/react';
import { ArrowBackIcon } from '@chakra-ui/icons';
import { getSender, getSenderName } from '../Chat/config/ChatLogics';
import ProfileModal from '../UserAvatar/ProfileModal';
import UpdateGroupChatModal from './UpdateGroupChatModal';
import ScrollableChat from './ScrollableChat';
import { socket } from './config/socket-connection';
import typingAnimation from '../../assets/hands-typing-on-keyboard.json';

import Lottie from 'react-lottie';

let selectedChatCompare;
const SingleChat = ({ fetchAgain, setFetchAgain }) => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [socketConnected, setSocketConnected] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [typing, setTyping] = useState(false);
  const {
    selectedChat,
    setSelectedChat,
    user,
    chats,
    setChats,
    notification,
    setNotification,
  } = ChatState();
  const toast = useToast();

  const lottieAnimationConfig = {
    loop: true,
    autoplay: true,
    animationData: typingAnimation,
    rendererSettings: {
      preserveAspectRatio: 'xMidYMid slice',
    },
  };

  useEffect(() => {
    // initial connections
    socket.emit('setup', user);
    console.log('socket connected');

    socket.on('connected', () => {
      setSocketConnected(true);
    });
    socket.on('message received', handleNewMessage);
    socket.on('typing', () => setIsTyping(true));
    socket.on('stop typing', () => setIsTyping(false));

    return () => {
      socket.disconnect();
    };
  }, []);

  useEffect(() => {
    fetchMessages();
    selectedChatCompare = selectedChat; // backup selected chat
  }, [selectedChat]);

  const handleNewMessage = (newMessageReceived) => {
    console.log({ selectedChatCompare, newMessageReceived });

    if (
      !selectedChatCompare ||
      selectedChatCompare._id !== newMessageReceived.chat._id
    ) {
      console.log('new message received but not in this chat');
      // give notification
      if (!notification.includes(newMessageReceived)) {
        setNotification((notificationList) => [
          ...notificationList,
          newMessageReceived,
        ]);
        setFetchAgain(!fetchAgain);
      }
    } else {
      setMessages((messages) => [...messages, newMessageReceived]);
    }
  };
  const sendMessage = async (e) => {
    if (e.key === 'Enter') {
      socket.emit('stop typing', selectedChat._id);
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

        setMessages((messages) => [...messages, data]);
        socket.emit('new message', data);
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
    if (!socketConnected) return console.log('socket not connected');
    if (!typing) {
      setTyping(true);
      socket.emit('typing', selectedChat._id);
      console.log({ id: selectedChat._id });
    }

    // NOTE: Throttle Function
    let lastTypingTime = new Date().getTime();
    let timerLength = 3000;
    setTimeout(() => {
      let timeNow = new Date().getTime();
      let timeDiff = timeNow - lastTypingTime;
      if (timeDiff >= timerLength && typing) {
        console.log({ chatId: selectedChat._id });
        socket.emit('stop typing', selectedChat._id);
        setTyping(false);
      }
    }, timerLength);
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

      // console.log({ messages });

      socket.emit('join chat', selectedChat._id);
      // what if it is a personal chat not a group chat?
      // ans. no it this connection implementation is only for single chat component.
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
              maxH={'90%'}
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
                <ScrollableChat messages={messages} />
              )}

              {/* messages */}
              <FormControl onKeyDown={sendMessage} isRequired mt={3}>
                {isTyping ? (
                  <Lottie
                    options={lottieAnimationConfig}
                    width={50}
                    height={35}
                    style={{ marginLeft: '10px', borderRadius: '50%' }}
                  />
                ) : (
                  <div style={{ height: '10px' }}> </div>
                )}
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
