/* eslint-disable react/prop-types */
import { useRef, useState, useEffect } from "react";
import style from './Chat.module.css';

export default function Chat({ socket }) {
    const bottomRef = useRef()
    const messageRef = useRef()
    const [messageList, setMessageList] = useState([]);

    useEffect(() => {
        socket.on(`receive_message`, data => {
            setMessageList(current => [...current, data]);
        });

        socket.on("messageDeleted", deletedMessageId => {
            setMessageList(prevMessages => prevMessages.filter(message => message.id !== deletedMessageId));
        });

        return () => {
            socket.off("receive_message");
            socket.off("messageDeleted");
        };
    }, [socket]);

    const handleSubmit = () => {
        const message = messageRef.current.value;
        if (!message.trim()) return;
        socket.emit("message", message);
        clearInput();
    };

    const clearInput = () => {
        messageRef.current.value = '';
    };

    useEffect(() => {
        scrollDown();
    }, [messageList]);

    const scrollDown = () => {
        bottomRef.current.scrollIntoView({ behavior: 'smooth' });
    };

    const handleDeleteMessage = messageId => {
        socket.emit("deleteMessage", messageId);
    };

    return (
        <div>
            <div className={style['chat-container']}>
                <div className={style["chat-body"]}>
                    {messageList.map((message, index) => (
                        <div className={`${style["message-container"]} ${message.authorId === socket.id && style["message-mine"]}`} key={index}>
                            <div className="message-author"><strong>{message.author}</strong></div>
                            <div className={`${style["message-flex"]}`}>
                                <div className="message-text">{message.text}</div>
                               
                                    <div onClick={() => handleDeleteMessage(message.id)}>
                                        <div className={`${style["button-delete"]}`}>&#10006;</div>
                                    </div>
                                
                            </div>
                        </div>
                    ))}
                    <div ref={bottomRef} />
                    <div className={style["chat-footer"]}>
                        <div className={style["input-footer"]}>
                            <input className={style["input-self-footer"]} type="text" ref={messageRef} placeholder="Mensagem" />
                        </div>
                        <button onClick={() => handleSubmit()}>Enviar</button>
                    </div>
                </div>
            </div>
        </div>
    );
}
