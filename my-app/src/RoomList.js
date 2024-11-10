import React, { useRef, useContext } from 'react';
import gameContext from '../gameContext';

const RoomList = ({ roomList, joinRoom }) => {
    const roomNameRef = useRef(null);
    const { setRoomName } = useContext(gameContext);

    return (
        <>
            {roomList[0] !== '' ? (
                roomList.map((roomName, index) => (
                    <div className="room" key={index}>
                        <h4 ref={roomNameRef}>{roomName}</h4>
                        <button
                            className="button2"
                            onClick={(e) => {
                                setRoomName(roomName);
                                joinRoom(e, roomName, false);
                            }}
                        >
                            Join
                        </button>
                    </div>
                ))
            ) : (
                <></>
            )}
        </>
    );
};

export default RoomList;
