// eslint-disable-next-line no-unused-vars
import React, { useRef, useState } from 'react';
import style from './Join.module.css';
import io from 'socket.io-client';

// eslint-disable-next-line react/prop-types
export default function Join({ setChatVisibility, setSocket }) {
  const usernameRef = useRef();
  const adminRef = useRef();
  // eslint-disable-next-line no-unused-vars
  const [admin, setAdmin] = useState("");

  const handleSubmit = async () => {
    const username = usernameRef.current.value;
    const adminValue = adminRef.current.value; 
    if (!username.trim() || !adminValue.trim()) return;

    const socket = await io.connect('http://localhost:3001');
    socket.emit('set_username', username);
    socket.emit('set_admin', adminValue); 
    setSocket(socket);
    setAdmin(adminValue);
    setChatVisibility(true);
  };

  return (
    <div className={style['join-container']}>
      <h1>Join</h1>
      <input type="text" ref={usernameRef} placeholder="Nome do usuário" />
      <input type="text" ref={adminRef} placeholder="Admin" />
      <button onClick={() => handleSubmit()}>Entrar</button>
    </div>
  );
}
