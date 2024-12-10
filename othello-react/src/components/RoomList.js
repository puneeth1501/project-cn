
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
