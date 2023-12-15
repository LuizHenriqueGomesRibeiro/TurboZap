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
    <div className={style['join-screen']}>
      <div className={style['join-container']}>
        <h1>Junte-se à sala</h1>
        <label htmlFor="nome">Digite seu nome:</label>
        <input id="nome" name="nome" className={style['join-input']} type="text" ref={usernameRef} placeholder="Nome do usuário" />
        <label htmlFor="admin">Você deseja ser <strong>Administrador</strong>?</label>
        <select id="admin" name="admin" ref={adminRef}>
          <option value="admin">Sim</option>
          <option value="nao">Nao</option>
        </select>
        <button className={style['join-button']} onClick={() => handleSubmit()}>Entrar</button>
      </div>
    </div>
  );
}
