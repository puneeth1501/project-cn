import React, { useContext, useState } from 'react';
import gameContext from '../../gameContext';
import {gameService,socketService} from '../../services/socketService';
import RoomList from '../RoomList';

export function JoinRoom() {
   const [isJoiningStatus, setJoiningStatus] = useState(false);
   const [inputError, setInputError] = useState('');
   
   const { 
       setInRoom, 
       roomList, 
       roomName, 
       setRoomName,
       setIsSpectator,
       setIsCreator
   } = useContext(gameContext);

   const joinExistingRoom = async (eventObj, selectedRoom, shouldCreate, joinAsSpectator) => {
       eventObj.preventDefault();
       
       try {
           setJoiningStatus(true);
           let socketConnection = socketService.socket;
           let playerType = joinAsSpectator ? 'spectator' : 'player';
           
           console.log(`Attempting to join "${selectedRoom}" as ${playerType}`);
           
           let joinAttempts = 0;
           do {
               let joinSuccess = await gameService.joinGameRoom(
                   socketConnection, 
                   selectedRoom, 
                   shouldCreate, 
                   joinAsSpectator
               );

               if (joinSuccess) {
                   let stateUpdates = {
                       spectator: joinAsSpectator,
                       creator: shouldCreate,
                       room: selectedRoom
                   };

                   setIsSpectator(stateUpdates.spectator);
                   setIsCreator(stateUpdates.creator);
                   setRoomName(stateUpdates.room);
                   setInRoom(true);
               }
               
               joinAttempts++;
           } while(joinAttempts < 1);
           
       } catch (joinError) {
           console.error('Room join failed:', joinError);
           setInputError('Failed to join room');
           alert(joinError);
       } finally {
           setJoiningStatus(false);
       }
   };
   
   const handleRoomInputChange = (eventObj) => {
       try {
           let newValue = eventObj.target.value;
           let maxLength = 20;
           
           let validatedValue = newValue.slice(0, maxLength);
           setInputError('');
           setRoomName(validatedValue);
           
       } catch (inputError) {
           console.error('Input handling failed:', inputError);
           setInputError('Error processing input');
       }
   };

   const createNewRoom = async (eventObj) => {
       eventObj.preventDefault();
       
       try {
           let roomNameToCreate = roomName.trim();
           let isValidInput = Boolean(roomNameToCreate);

           if (!isValidInput) {
               let errorMsg = 'Please enter a room name';
               setInputError(errorMsg);
               alert(errorMsg);
               return;
           }

           setJoiningStatus(true);
           let socketConnection = socketService.socket;
           
           let attempts = 0;
           while(attempts < 1) {
               console.log('Attempting room creation:', roomNameToCreate);
               attempts++;
               
               let joinSuccess = await gameService.joinGameRoom(
                   socketConnection, 
                   roomNameToCreate, 
                   true, 
                   false
               );

               if (joinSuccess) {
                   let updateFlags = async () => {
                       setIsSpectator(false);
                       setIsCreator(true);
                       setRoomName(roomNameToCreate);
                       setInRoom(true);
                   };
                   await updateFlags();
               }
           }
       } catch (createError) {
           console.error('Room creation failed:', createError);
           setInputError('Failed to create room');
           alert(createError);
       } finally {
           setJoiningStatus(false);
       }
   };

   return (
       <div className="join-room-page">
           <div className="join-room-section">
               <h2>Join Existing Room</h2>
               <RoomList 
                   roomList={roomList} 
                   joinRoom={joinExistingRoom} 
               />
           </div>

           <div className="divider">OR</div>

           <div className="create-room-section">
               <h2>Create New Room</h2>
               {inputError && <div className="error-message">{inputError}</div>}
               <div className="create-room-form">
                   <input
                       type="text"
                       placeholder="Enter Room Name"
                       value={roomName}
                       onChange={handleRoomInputChange}
                       className="room-input"
                       maxLength={20}
                   />
                   <button 
                       onClick={createNewRoom}
                       disabled={isJoiningStatus || !roomName.trim()}
                       className="create-button"
                   >
                       {isJoiningStatus ? 'Creating...' : 'Create Room'}
                   </button>
               </div>
           </div>
       </div>
   );
}
