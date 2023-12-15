import { useState } from 'react';
import './App.css';
import Join from './components/Join/Join';
import Chat from './components/Chat/Chat';

function App() {
  const [chatVisibility, setChatVisibility] = useState(false);
  const [socket, setSocket] = useState(null);
  const [admin, setAdmin] = useState("");

  return (
    <div className="App">
      {
        chatVisibility ? (
          <Chat socket={socket} admin={admin} setAdmin={setAdmin} />
        ) : (
          <Join setSocket={setSocket} setChatVisibility={setChatVisibility} />
        )
      }
    </div>
  );
}

export default App;
