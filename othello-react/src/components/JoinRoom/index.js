
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
