//very very impor
// import React, { useContext, useState } from 'react';
// import gameContext from '../../gameContext';
// import gameService from '../../services/gameService';
// import socketService from '../../services/socketService';
// import RoomList from '../../components/RoomList';

// export function JoinRoom() {
//     const [isJoining, setJoining] = useState(false);

//     const { setInRoom, roomList, roomName, setRoomName } = useContext(gameContext);

//     const handleRoomNameChange = (e) => {
//         const value = e.target.value;
//         setRoomName(value);
//     };

//     const joinRoom = async (e, roomName, createRoom) => {
//         e.preventDefault();
//         const socket = socketService.socket;
//         if (!roomName || roomName.trim() === '' || !socket) return;

//         setJoining(true);

//         try {
//             const joined = await gameService.joinGameRoom(socket, roomName, createRoom);
//             if (joined) setInRoom(true);
//         } catch (err) {
//             alert(err);
//             window.location.reload();
//         }

//         setJoining(false);
//     };

//     return (
//         <>
//             <div className="join-room-div">
//                 <div className="group">
//                     <input value={roomName} onChange={handleRoomNameChange} />
//                     <span className="highlight"></span>
//                     <span className="bar"></span>
//                     <label>RoomName</label>
//                 </div>
//                 <button
//                     className="button1"
//                     disabled={isJoining}
//                     onClick={(e) => joinRoom(e, roomName, true)}
//                 >
//                     {isJoining ? 'Creating...' : 'CREATE'}
//                 </button>
//                 <button
//                     className="button1"
//                     disabled={isJoining}
//                     onClick={(e) => joinRoom(e, roomName, false)}
//                 >
//                     {isJoining ? 'Joining...' : 'JOIN'}
//                 </button>
//             </div>
//             <div className="room-list">
//                 <RoomList roomList={roomList} joinRoom={joinRoom} />
//             </div>
//         </>
//     );
// }


// src/components/JoinRoom/index.js
// import React, { useContext, useState } from 'react';
// import gameContext from '../../gameContext';
// // import gameService from '../../services/gameService';
// import {gameService,socketService} from '../../services/socketService';
// import RoomList from '../RoomList';
// import '../../index.css'

// export function JoinRoom() {
//     const [isJoining, setJoining] = useState(false);
//     const { setInRoom, roomList, roomName, setRoomName, setIsSpectator } = useContext(gameContext);
    
//     const handleRoomNameChange = (e) => {
//         setRoomName(e.target.value);
//     };

//     // const createRoom = async (e) => {
//     //     e.preventDefault();
//     //     if (!roomName || roomName.trim() === '') {
//     //         alert('Please enter a room name');
//     //         return;
//     //     }
//     //     setJoining(true);
//     //     try {
//     //         const socket = socketService.socket;
//     //         const joined = await gameService.joinGameRoom(socket, roomName, true, false);
//     //         if (joined) {
//     //             setIsSpectator(false);
//     //             setInRoom(true);
//     //         }
//     //     } catch (err) {
//     //         alert(err);
//     //     }
//     //     setJoining(false);
//     // };


//     // const createRoom = async (e) => {
//     //     e.preventDefault();
//     //     if (!roomName || roomName.trim() === '') {
//     //         alert('Please enter a room name');
//     //         return;
//     //     }
//     //     setJoining(true);
//     //     try {
//     //         const socket = socketService.socket;
//     //         const joined = await gameService.joinGameRoom(socket, roomName, true, false);
//     //         if (joined) {
//     //             setIsSpectator(false);
//     //             setRoomName(roomName);  // Make sure this line is here
//     //             setInRoom(true);
//     //         }
//     //     } catch (err) {
//     //         alert(err);
//     //     }
//     //     setJoining(false);
//     // };

//     //bottom impo
    

//     // const joinRoom = async (e, roomName, createRoom, asSpectator) => {
//     //     e.preventDefault();
//     //     setJoining(true);
//     //     try {
//     //         const socket = socketService.socket;
//     //         const joined = await gameService.joinGameRoom(socket, roomName, createRoom, asSpectator);
//     //         if (joined) {
//     //             setIsSpectator(asSpectator);
//     //             setInRoom(true);
//     //         }
//     //     } catch (err) {
//     //         alert(err);
//     //     }
//     //     setJoining(false);
//     // };


// // const joinRoom = async (e, roomName, createRoom, asSpectator) => {
// //     e.preventDefault();
// //     setJoining(true);
// //     try {
// //         const socket = socketService.socket;
// //         console.log('Joining room:', roomName); // Add this log
// //         const joined = await gameService.joinGameRoom(socket, roomName, createRoom, asSpectator);
// //         if (joined) {
// //             setIsSpectator(asSpectator);
// //             setRoomName(roomName);  // Make sure this line is here
// //             setInRoom(true);
// //         }
// //     } catch (err) {
// //         alert(err);
// //     }
// //     setJoining(false);
// // };

// //bottom imp...


// const createRoom = async (e) => {
//     e.preventDefault();
//     if (!roomName || roomName.trim() === '') {
//         alert('Please enter a room name');
//         return;
//     }
//     setJoining(true);
//     try {
//         const socket = socketService.socket;
//         const joined = await gameService.joinGameRoom(socket, roomName, true, false);
//         if (joined) {
//             setIsSpectator(false);
//             setIsCreator(true); // Add this
//             setInRoom(true);
//         }
//     } catch (err) {
//         alert(err);
//     }
//     setJoining(false);
// };

// const joinRoom = async (e, roomName, createRoom, asSpectator) => {
//     e.preventDefault();
//     setJoining(true);
//     try {
//         const socket = socketService.socket;
//         const joined = await gameService.joinGameRoom(socket, roomName, createRoom, asSpectator);
//         if (joined) {
//             setIsSpectator(asSpectator);
//             setIsCreator(createRoom); // Add this
//             setInRoom(true);
//         }
//     } catch (err) {
//         alert(err);
//     }
//     setJoining(false);
// };
//     return (
//         <div className="join-room-page">
//             <div className="create-room-section">
//                 <h2>Create New Room</h2>
//                 <div className="create-room-form">
//                     <input
//                         type="text"
//                         placeholder="Enter Room Name"
//                         value={roomName}
//                         onChange={handleRoomNameChange}
//                         className="room-input"
//                     />
//                     <button 
//                         onClick={createRoom}
//                         disabled={isJoining}
//                         className="create-button"
//                     >
//                         {isJoining ? 'Creating...' : 'Create Room'}
//                     </button>
//                 </div>
//             </div>

//             <div className="divider">OR</div>

//             <div className="join-room-section">
//                 {/* Show available rooms */}
//                 <RoomList roomList={roomList} joinRoom={joinRoom} />
//             </div>
//         </div>
//     );
// }



//---------------

// src/components/JoinRoom/index.js
import React, { useContext, useState } from 'react';
import gameContext from '../../gameContext';
// import gameService from '../../services/gameService';
import {gameService,socketService} from '../../services/socketService';
import RoomList from '../RoomList';

export function JoinRoom() {
    const [isJoining, setJoining] = useState(false);
    const { 
        setInRoom, 
        roomList, 
        roomName, 
        setRoomName,
        setIsSpectator,
        setIsCreator  // Added this
    } = useContext(gameContext);
    
    const handleRoomNameChange = (e) => {
        const value = e.target.value;
        setRoomName(value);
    };

    const createRoom = async (e) => {
        e.preventDefault();
        const trimmedName = roomName.trim();
        if (!trimmedName) {
            alert('Please enter a room name');
            return;
        }
        setJoining(true);
        try {
            const socket = socketService.socket;
            console.log('Creating room:', trimmedName);
            
            const joined = await gameService.joinGameRoom(socket, trimmedName, true, false);
            if (joined) {
                setIsSpectator(false);
                setIsCreator(true); // Set creator status
                setRoomName(trimmedName);
                setInRoom(true);
            }
        } catch (err) {
            alert(err);
        }
        setJoining(false);
    };

    const joinRoom = async (e, roomName, createRoom, asSpectator) => {
        e.preventDefault();
        setJoining(true);
        try {
            const socket = socketService.socket;
            console.log(`Joining room "${roomName}" as ${asSpectator ? 'spectator' : 'player'}`);
            
            const joined = await gameService.joinGameRoom(socket, roomName, createRoom, asSpectator);
            if (joined) {
                setIsSpectator(asSpectator);
                setIsCreator(createRoom); // Set creator status based on join type
                setRoomName(roomName);
                setInRoom(true);
            }
        } catch (err) {
            alert(err);
        }
        setJoining(false);
    };

    return (
        <div className="join-room-page">
            <div className="create-room-section">
                <h2>Create New Room</h2>
                <div className="create-room-form">
                    <input
                        type="text"
                        placeholder="Enter Room Name"
                        value={roomName}
                        onChange={handleRoomNameChange}
                        className="room-input"
                        maxLength={20} // Limit room name length
                    />
                    <button 
                        onClick={createRoom}
                        disabled={isJoining || !roomName.trim()}
                        className="create-button"
                    >
                        {isJoining ? 'Creating...' : 'Create Room'}
                    </button>
                </div>
            </div>

            <div className="divider">OR</div>

            <div className="join-room-section">
                <h2>Join Existing Room</h2>
                <RoomList roomList={roomList} joinRoom={joinRoom} />
            </div>
        </div>
    );
}
