//very very imp
// import React, { useRef, useContext } from 'react';
// import gameContext from '../gameContext';

// const RoomList = ({ roomList, joinRoom }) => {
//     const roomNameRef = useRef(null);
//     const { setRoomName } = useContext(gameContext);

//     return (
//         <>
//             {roomList[0] !== '' ? (
//                 roomList.map((roomName, index) => (
//                     <div className="room" key={index}>
//                         <h4 ref={roomNameRef}>{roomName}</h4>
//                         <button
//                             className="button2"
//                             onClick={(e) => {
//                                 setRoomName(roomName);
//                                 joinRoom(e, roomName, false);
//                             }}
//                         >
//                             Join
//                         </button>
//                     </div>
//                 ))
//             ) : (
//                 <></>
//             )}
//         </>
//     );
// };

// export default RoomList;


// src/components/RoomList.js
// `import React from 'react';
// import '../index.css'
// const RoomList = ({ roomList, joinRoom }) => {
//     return (
//         <div className="room-list">
//             <h2>Available Rooms</h2>
//             {roomList && roomList.length > 0 ? (
//                 <div className="rooms-container">
//                     {roomList.map((room, index) => (
//                         <div key={index} className="room-card">
//                             <div className="room-header">
//                                 Room: {room.name}
//                                 <div className="player-count">
//                                     Players: {room.playerCount}/2
//                                 </div>
//                             </div>
//                             <div className="room-actions">
//                                 {room.playerCount < 2 && (
//                                     <button 
//                                         className="join-button"
//                                         onClick={(e) => joinRoom(e, room.name, false, false)}
//                                     >
//                                         Join Game
//                                     </button>
//                                 )}
//                                 <button 
//                                     className="spectate-button"
//                                     onClick={(e) => joinRoom(e, room.name, false, true)}
//                                 >
//                                     Watch Game
//                                 </button>
//                             </div>
//                         </div>
//                     ))}
//                 </div>
//             ) : (
//                 <div className="no-rooms">
//                     <p>No active rooms found</p>
//                     <p>Create a room to start playing!</p>
//                 </div>
//             )}
//         </div>
//     );
// };

// export default RoomList;`
//very imp..

// src/components/RoomList.js
import React from 'react';

const RoomList = ({ roomList, joinRoom }) => {
    return (
        <div className="room-list">
            <h2>Available Rooms</h2>
            {roomList && roomList.length > 0 ? (
                <div className="rooms-container">
                    {roomList.map((room, index) => (
                        <div key={index} className="room-card">
                            <div className="room-header">
                                {/* Simplified room display */}
                                Room: {room.name.split('-')[0]} {/* Show only first part of room ID */}
                                <div className="player-count">
                                    Players: {room.playerCount}/2
                                </div>
                            </div>
                            <div className="room-actions">
                                {room.playerCount < 2 && (
                                    <button 
                                        className="join-button"
                                        onClick={(e) => joinRoom(e, room.name, false, false)}
                                    >
                                        Join Game
                                    </button>
                                )}
                                <button 
                                    className="spectate-button"
                                    onClick={(e) => joinRoom(e, room.name, false, true)}
                                >
                                    Watch Game
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="no-rooms">
                    <p>No active rooms</p>
                    <p>Create a room to start playing!</p>
                </div>
            )}
        </div>
    );
};

export default RoomList;