import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Text,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
} from '@chakra-ui/react';
import Signup from './../Components/Authentication/Signup';
import Login from '../Components/Authentication/Login';
import { useHistory } from 'react-router-dom/cjs/react-router-dom.min';

const HomePage = () => {
  const history = useHistory();

  useEffect(() => {
    const userInfo = JSON.parse(localStorage.getItem('userInfo'));

    if (userInfo) {
      history.push('/chat');
    }
  }, [history]);
  return (
    <Container maxW="xl">
      <Box height="20px" />
      <Box
        display="flex"
        justifyContent="center"
        p={3}
        bg="white"
        width={'100%'}
        borderRadius="lg"
        borderWidth={'1px'}
      >
        <Text fontSize="4xl" color="black" fontFamily="work sans">
          Talktaive
        </Text>
      </Box>
      <Box height="10px" />
      <Box
        bg="white"
        width={'100%'}
        borderRadius="lg"
        borderWidth={'1px'}
        p="5px"
      >
        <Tabs isFitted variant="soft-rounded" colorScheme="blue" color="black">
          <TabList>
            <Tab>Login</Tab>
            <Tab>Signup</Tab>
          </TabList>
          <TabPanels>
            <TabPanel>
              <Login />{' '}
            </TabPanel>
            <TabPanel>
              {' '}
              <Signup />
            </TabPanel>
          </TabPanels>
        </Tabs>
      </Box>
    </Container>
  );
};

export default HomePage;
