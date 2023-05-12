import { Avatar, Box, Text } from '@chakra-ui/react';
import React from 'react';
import { ChatState } from './../../context/ChatProvider';

const UserListItem = ({ contact, handleFunction }) => {
  const { user } = ChatState();
  return (
    <Box
      onClick={handleFunction}
      _hover={{ bg: 'blue.200', color: 'white', cursor: 'pointer' }}
      px={3}
      py={3}
      my={2}
      borderRadius="lg"
      color="black"
      width="100%"
      display="flex"
      alignItems="center"
    >
      <Avatar
        size="sm"
        name={contact.name}
        src={contact.pic}
        cursor="pointer"
      />
      <Box>
        <Text ml={2} fontSize="lg" fontFamily="Work sans">
          {contact.name}
        </Text>
        <Text ml={2} fontSize="sm" fontFamily="Work sans">
          <b>Email:</b>
          {contact.email}
        </Text>
      </Box>
    </Box>
  );
};

export default UserListItem;
