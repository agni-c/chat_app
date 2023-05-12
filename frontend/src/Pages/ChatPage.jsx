import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ChatProvider, { ChatState } from '../context/ChatProvider';
import SideDrawer from '../Components/layouts/SideDrawer';
import { Box } from '@chakra-ui/react';
import MyChats from '../Components/layouts/MyChats';
import ChatBox from '../Components/layouts/ChatBox';
const ChatPage = () => {
  const { user } = ChatState();
  const [fetchAgain, setFetchAgain] = useState(false);

  return (
    <div>
      {user && <SideDrawer />}

      <Box
        display="flex"
        justifyContent="space-between"
        w="100%"
        h="92vh"
        p="10px"
      >
        {user && (
          <MyChats fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} />
        )}
        {user && (
          <ChatBox fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} />
        )}
      </Box>
    </div>
  );
};

export default ChatPage;
