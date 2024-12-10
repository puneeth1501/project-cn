
import React, { useState, useEffect, useRef } from 'react';
import '../../index.css'

const Chat = ({ socket, roomName, isSpectator }) => {
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const messagesEndRef = useRef(null);
    const [playerName] = useState(`${isSpectator ? 'Spectator' : 'Player'}_${Math.floor(Math.random() * 1000)}`);

    useEffect(() => {
        if (!socket) return;
        console.log('Chat component mounted with room:', roomName); // Add this log

        const handleMessage = (message) => {
            console.log('Received message:', message);
            setMessages(prev => [...prev, message]);
        };

        const handleSystemMessage = (message) => {
            console.log('System message:', message);
            setMessages(prev => [...prev, { ...message, isSystem: true }]);
        };

        socket.on('chat_message', handleMessage);
        socket.on('system_message', handleSystemMessage);

        return () => {
            socket.off('chat_message', handleMessage);
            socket.off('system_message', handleSystemMessage);
        };
    }, [socket, roomName]);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    const sendMessage = (e) => {
        e.preventDefault();
        if (!newMessage.trim() || !socket || !roomName) return;

        const messageData = {
            roomName,
            message: {
                sender: playerName,
                content: newMessage.trim(),
                isSpectator,
                timestamp: new Date().toISOString()
            }
        };

        console.log('Sending message:', messageData); // Add this log
        socket.emit('send_message', messageData);
        setNewMessage('');
    };

    // If no roomName is provided, don't render the chat
    if (!roomName) {
        console.log('No room name provided to chat component');
        return null;
    }

    return (
        <div className="chat-container">
            <div className="chat-header">
                Chat Room - {roomName}
            </div>
            <div className="messages-container">
                {messages.map((msg, index) => (
                    <div 
                        key={`${msg.timestamp}-${index}`}
                        className={`message ${msg.isSystem ? 'system' : ''} 
                                  ${msg.isSpectator ? 'spectator' : ''}`}
                    >
                        {msg.isSystem ? (
                            <div className="system-message">{msg.content}</div>
                        ) : (
                            <>
                                <span className="sender">{msg.sender}: </span>
                                <span className="content">{msg.content}</span>
                            </>
                        )}
                    </div>
                ))}
                <div ref={messagesEndRef} />
            </div>
            <form onSubmit={sendMessage} className="message-form">
                <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="Type a message..."
                    className="message-input"
                />
                <button 
                    type="submit" 
                    className="send-button"
                    disabled={!newMessage.trim()}
                >
                    Send
                </button>
            </form>
        </div>
    );
};

export default Chat;
