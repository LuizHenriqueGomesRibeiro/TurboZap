/* eslint-disable react/prop-types */
// eslint-disable-next-line no-unused-vars
import React, { useRef, useState, useEffect } from "react";
import style from './Chat.module.css'

// eslint-disable-next-line react/prop-types
export default function Chat({socket}) {

    const bottomRef = useRef()
    const messageRef = useRef()
    // eslint-disable-next-line no-unused-vars
    const [ messageList, setMessageList ] = useState([])

    useEffect(() => {
        // eslint-disable-next-line react/prop-types
        socket.on(`receive_message`, data => {
            setMessageList((current) => [...current, data])
        })
        // eslint-disable-next-line react/prop-types
        return () => socket.off('receive_message')
    }, [socket])

    const handleSubmit = () => {
        const message = messageRef.current.value
        if(!message.trim) return
        // eslint-disable-next-line react/prop-types
        socket.emit('message', message)
        clearInput()
    }

    function excluirMensagem() {
        const botao = event.target;
        const divPai = botao.parentNode;
        const divAvo = divPai.parentNode;
        const divBisavo = divAvo.parentNode;
        divBisavo.remove();
    }

    const clearInput = () => {
        messageRef.current.value = ''
    }

    useEffect(()=>{
        scrollDown()
      }, [messageList])

    const scrollDown = () => {
    bottomRef.current.scrollIntoView({behavior: 'smooth'})
    }

    return (
        <div>
            <div className={style['chat-container']}>
                <div className={style["chat-body"]}>
                    {
                        messageList.map((message, index) => (
                            // eslint-disable-next-line react/prop-types
                            <div className={`${style["message-container"]} ${message.authorId === socket.id && style["message-mine"]}`} key={index}>
                                <div className="message-author"><strong>{message.author}</strong></div>
                                <div className="message-flex">
                                    <div className="message-text">{message.text}</div>
                                    {
                                        message.authorId === socket.id && message.admin === 'admin' &&
                                        <div> 
                                            <button onClick={() => excluirMensagem()}>Excluir</button>
                                        </div>
                                    }
                                </div>
                            </div>
                        ))
                    }
                    <div ref={bottomRef} />
                    <div className={style["chat-footer"]}>
                        <input type="text" ref={messageRef} placeholder="Mensagem" />
                        <button onClick={() => handleSubmit()}>Enviar</button>
                    </div>
                </div>
            </div>
        </div>
    );
}
