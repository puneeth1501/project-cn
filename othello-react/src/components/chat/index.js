// // src/components/Chat/index.js
// import React, { useState, useEffect, useRef } from 'react';

// const Chat = ({ socket, roomName, isSpectator }) => {
//     const [messages, setMessages] = useState([]);
//     const [newMessage, setNewMessage] = useState('');
//     const messagesEndRef = useRef(null);
//     const [playerName] = useState(`${isSpectator ? 'Spectator' : 'Player'}_${Math.floor(Math.random() * 1000)}`);

//     const scrollToBottom = () => {
//         messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
//     };

//     useEffect(() => {
//         if (!socket) return;

//         // Listen for chat messages
//         socket.on('chat_message', (message) => {
//             setMessages(prev => [...prev, message]);
//         });

//         // Listen for system messages
//         socket.on('system_message', (message) => {
//             setMessages(prev => [...prev, { ...message, isSystem: true }]);
//         });

//         return () => {
//             socket.off('chat_message');
//             socket.off('system_message');
//         };
//     }, [socket]);

//     useEffect(() => {
//         scrollToBottom();
//     }, [messages]);

//     const sendMessage = (e) => {
//         e.preventDefault();
//         if (!newMessage.trim() || !socket) return;

//         const messageData = {
//             roomName,
//             message: {
//                 sender: playerName,
//                 content: newMessage,
//                 isSpectator
//             }
//         };

//         socket.emit('send_message', messageData);
//         setNewMessage('');
//     };

//     return (
//         <div className="chat-container">
//             <div className="chat-header">
//                 Chat - {roomName}
//             </div>
//             <div className="messages-container">
//                 {messages.map((msg, index) => (
//                     <div 
//                         key={index} 
//                         className={`message ${msg.isSystem ? 'system' : ''} ${msg.isSpectator ? 'spectator' : ''}`}
//                     >
//                         {msg.isSystem ? (
//                             <div className="system-message">{msg.content}</div>
//                         ) : (
//                             <>
//                                 <span className="sender">{msg.sender}: </span>
//                                 <span className="content">{msg.content}</span>
//                             </>
//                         )}
//                     </div>
//                 ))}
//                 <div ref={messagesEndRef} />
//             </div>
//             <form onSubmit={sendMessage} className="message-form">
//                 <input
//                     type="text"
//                     value={newMessage}
//                     onChange={(e) => setNewMessage(e.target.value)}
//                     placeholder="Type a message..."
//                     className="message-input"
//                 />
//                 <button type="submit" className="send-button">Send</button>
//             </form>
//         </div>
//     );
// };

// export default Chat;


// src/components/Chat/index.js
// import React, { useState, useEffect, useRef } from 'react';

// const Chat = ({ socket, roomName, isSpectator }) => {
//     const [messages, setMessages] = useState([]);
//     const [newMessage, setNewMessage] = useState('');
//     const messagesEndRef = useRef(null);
//     const [playerName] = useState(`${isSpectator ? 'Spectator' : 'Player'}_${Math.floor(Math.random() * 1000)}`);

//     const scrollToBottom = () => {
//         messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
//     };

//     useEffect(() => {
//         if (!socket) return;

//         const handleChatMessage = (message) => {
//             console.log('Received message:', message);
//             setMessages(prev => [...prev, message]);
//         };

//         const handleSystemMessage = (message) => {
//             setMessages(prev => [...prev, { ...message, isSystem: true }]);
//         };

//         socket.on('chat_message', handleChatMessage);
//         socket.on('system_message', handleSystemMessage);

//         return () => {
//             socket.off('chat_message', handleChatMessage);
//             socket.off('system_message', handleSystemMessage);
//         };
//     }, [socket]);

//     useEffect(() => {
//         scrollToBottom();
//     }, [messages]);

//     const sendMessage = (e) => {
//         e.preventDefault();
//         if (!newMessage.trim() || !socket) return;

//         const messageData = {
//             roomName,
//             message: {
//                 sender: playerName,
//                 content: newMessage,
//                 isSpectator,
//                 timestamp: new Date().toISOString()
//             }
//         };

//         socket.emit('send_message', messageData);
        
//         // Add message to local state
//         setMessages(prev => [...prev, messageData.message]);
//         setNewMessage('');
//     };

//     return (
//         <div className="chat-container">
//             <div className="chat-header">
//                 Chat Room - {roomName}
//             </div>
//             <div className="messages-container">
//                 {messages.map((msg, index) => (
//                     <div 
//                         key={index} 
//                         className={`message ${msg.isSystem ? 'system' : ''} ${msg.isSpectator ? 'spectator' : ''}`}
//                     >
//                         {msg.isSystem ? (
//                             <div className="system-message">{msg.content}</div>
//                         ) : (
//                             <>
//                                 <span className="sender">{msg.sender}: </span>
//                                 <span className="content">{msg.content}</span>
//                             </>
//                         )}
//                     </div>
//                 ))}
//                 <div ref={messagesEndRef} />
//             </div>
//             <form onSubmit={sendMessage} className="message-form">
//                 <input
//                     type="text"
//                     value={newMessage}
//                     onChange={(e) => setNewMessage(e.target.value)}
//                     placeholder="Type a message..."
//                     className="message-input"
//                 />
//                 <button type="submit" className="send-button">Send</button>
//             </form>
//         </div>
//     );
// };

// export default Chat;


// // src/components/Chat/index.js
// import React, { useState, useEffect, useRef } from 'react';

// const Chat = ({ socket, roomName, isSpectator }) => {
//     const [messages, setMessages] = useState([]);
//     const [newMessage, setNewMessage] = useState('');
//     const messagesEndRef = useRef(null);
//     const [playerName] = useState(`${isSpectator ? 'Spectator' : 'Player'}_${Math.floor(Math.random() * 1000)}`);

//     useEffect(() => {
//         if (!socket || !roomName) return;  // Add roomName check

//         const handleChatMessage = (message) => {
//             console.log('Received message:', message);
//             setMessages(prev => [...prev, message]);
//         };

//         const handleSystemMessage = (message) => {
//             console.log('System message:', message);
//             setMessages(prev => [...prev, { ...message, isSystem: true }]);
//         };

//         // Join chat room
//         socket.emit('join_chat', { roomName });

//         socket.on('chat_message', handleChatMessage);
//         socket.on('system_message', handleSystemMessage);

//         return () => {
//             socket.off('chat_message', handleChatMessage);
//             socket.off('system_message', handleSystemMessage);
//         };
//     }, [socket, roomName]);  // Add roomName to dependency array

//     useEffect(() => {
//         messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
//     }, [messages]);

//     const sendMessage = (e) => {
//         e.preventDefault();
//         if (!newMessage.trim() || !socket || !roomName) return;  // Add roomName check

//         console.log('Current room name:', roomName); // Debug log

//         const messageData = {
//             roomName,
//             message: {
//                 sender: playerName,
//                 content: newMessage.trim(),
//                 isSpectator,
//                 timestamp: new Date().toISOString()
//             }
//         };

//         console.log('Sending message:', messageData);
//         socket.emit('send_message', messageData);
        
//         // Add message to local state immediately
//         setMessages(prev => [...prev, {
//             ...messageData.message,
//             isLocal: true
//         }]);
        
//         setNewMessage('');
//     };

//     return (
//         <div className="chat-container">
//             <div className="chat-header">
//                 Chat Room - {roomName || 'Not Connected'}
//             </div>
//             <div className="messages-container">
//                 {messages.map((msg, index) => (
//                     <div 
//                         key={`${msg.timestamp}-${index}`}
//                         className={`message ${msg.isSystem ? 'system' : ''} 
//                                   ${msg.isSpectator ? 'spectator' : ''}
//                                   ${msg.isLocal ? 'local' : ''}`}
//                     >
//                         {msg.isSystem ? (
//                             <div className="system-message">{msg.content}</div>
//                         ) : (
//                             <>
//                                 <span className="sender">{msg.sender}: </span>
//                                 <span className="content">{msg.content}</span>
//                             </>
//                         )}
//                     </div>
//                 ))}
//                 <div ref={messagesEndRef} />
//             </div>
//             <form onSubmit={sendMessage} className="message-form">
//                 <input
//                     type="text"
//                     value={newMessage}
//                     onChange={(e) => setNewMessage(e.target.value)}
//                     placeholder="Type a message..."
//                     className="message-input"
//                     disabled={!roomName}
//                 />
//                 <button 
//                     type="submit" 
//                     className="send-button"
//                     disabled={!roomName || !newMessage.trim()}
//                 >
//                     Send
//                 </button>
//             </form>
//         </div>
//     );
// };

// export default Chat;

//bottom imp


// src/components/Chat/index.js
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