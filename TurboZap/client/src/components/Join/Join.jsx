// eslint-disable-next-line no-unused-vars
import React, {useRef} from 'react'
import style from './Join.module.css'
import io from 'socket.io-client'

// eslint-disable-next-line react/prop-types
export default function Join({setChatVisibility, setSocket}) {
  
  const usernameRef = useRef()

  const handleSubmit = async () => {
    const username = usernameRef.current.value
    if(!username.trim()) return
    const socket = await io.connect('http://localhost:3001')
    socket.emit('set_username', username)
    setSocket(socket)
    setChatVisibility(true)
  }

  return (
    <div  className={style['join-container']}>
      <h1>Join</h1>
      <input type="text" ref={usernameRef} placeholder='Nome do usuário'/>
      <label htmlFor="admin">Deseja ser administrador</label>
      <select id="admin" name="admin">
        <option value="admin">Sim</option>
        <option value="nao">Nao</option>
      </select>
      <button onClick={() => handleSubmit()}>Entrar</button>
    </div>
  )
}
