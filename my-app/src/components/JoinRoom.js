import React, { useState, useEffect, useContext } from 'react';
import socketService from '../services/socketService';
import gameContext from '../gameContext';

function JoinRoom() {
  const [roomName, setRoomName] = useState('');
  const [availableRooms, setAvailableRooms] = useState([]);
  const { setInRoom, setRoomName: setContextRoomName } = useContext(gameContext);

  useEffect(() => {
    socketService.onRoomCreated(({ roomId }) => {
      console.log('Room created:', roomId);
      setContextRoomName(roomId);
      setInRoom(true);
    });

    socketService.onRoomJoined(({ roomId }) => {
      console.log('Room joined:', roomId);
      setContextRoomName(roomId);
      setInRoom(true);
    });

    socketService.onRoomJoinError((error) => {
      console.error('Room join error:', error);
      alert(error.error);
    });

    socketService.onRoomListUpdate((roomList) => {
      console.log('Room list updated:', roomList);
      setAvailableRooms(roomList);
    });

    socketService.onSpectatorJoined(({ roomId }) => {
      console.log('Joined as spectator:', roomId);
      setContextRoomName(roomId);
      setInRoom(true);
    });

    socketService.getRoomList();

    return () => {
      socketService.off('room_created');
      socketService.off('room_joined');
      socketService.off('room_join_error');
      socketService.off('room_list_update');
      socketService.off('spectator_joined');
    };
  }, [setInRoom, setContextRoomName]);

  const handleCreateRoom = () => {
    if (roomName.trim() !== '') {
      socketService.createGame(roomName);
    } else {
      alert('Please enter a room name');
    }
  };

  const handleJoinRoom = (roomToJoin) => {
    socketService.joinGame(roomToJoin);
  };

  const handleSpectateRoom = (roomToSpectate) => {
    socketService.joinAsSpectator(roomToSpectate);
  };

  return (
    <div className="join-room-container">
      <input
        value={roomName}
        onChange={(e) => setRoomName(e.target.value)}
        placeholder="Room Name"
      />
      <button onClick={handleCreateRoom}>CREATE ROOM</button>
      <div className="available-rooms">
        <h3>Available Rooms:</h3>
        {availableRooms.length > 0 ? (
          availableRooms.map((room, index) => (
            <div key={index}>
              <button onClick={() => handleJoinRoom(room)}>Join {room}</button>
              <button onClick={() => handleSpectateRoom(room)}>Spectate {room}</button>
            </div>
          ))
        ) : (
          <p>No rooms available. Create one to start playing!</p>
        )}
      </div>
    </div>
  );
}

export default JoinRoom;