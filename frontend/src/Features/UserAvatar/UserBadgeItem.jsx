import { CloseIcon } from '@chakra-ui/icons';
import { Box } from '@chakra-ui/react';
import React from 'react';

const UserBadgeItem = ({ user, handleFunction }) => {
  return (
    <Box
      px={2}
      py={1}
      borderRadius={'lg'}
      m={1}
      mb={2}
      fontFamily={12}
      background="cyan.500"
      color={'white'}
      cursor={'pointer'}
      onClick={handleFunction}
    >
      {user.name} <CloseIcon pl={2} onClick={handleFunction} />
    </Box>
  );
};

export default UserBadgeItem;
