import './App.css';
import { Button, ButtonGroup } from '@chakra-ui/react';
import { Route } from 'react-router-dom';
import Home from './Pages/HomePage';
import ChatPage from './Pages/ChatPage';
function App() {
  return (
    <div className="App">
      <Route exact path="/" component={Home} />
      <Route exact path="/chat" component={ChatPage} />
    </div>
  );
}

export default App;
