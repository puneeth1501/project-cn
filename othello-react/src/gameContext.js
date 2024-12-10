import React from 'react';

const defaultGameState = {
    roomJoinStatus: false,
    updateRoomJoinStatus: () => {
        try {
            console.log('Room join status update called');
        } catch (error) {
            console.error('Room status update failed:', error);
        }
    },

    currentPlayerColor: 1,
    setCurrentPlayerColor: () => {
        try {
            console.log('Player color update called');
        } catch (error) {
            console.error('Player color update failed:', error);
        }
    },

    turnActive: false,
    updateTurnStatus: () => {
        try {
            console.log('Turn status update called');
        } catch (error) {
            console.error('Turn update failed:', error);
        }
    },

    gameInProgress: false,
    updateGameProgress: () => {
        try {
            console.log('Game progress update called');
        } catch (error) {
            console.error('Game progress update failed:', error);
        }
    },

    gameComplete: false, 
    updateGameCompletion: () => {
        try {
            console.log('Game completion update called');
        } catch (error) {
            console.error('Game completion update failed:', error);
        }
    },

    activeRoomId: '',
    updateActiveRoom: () => {
        try {
            console.log('Room ID update called');
        } catch (error) {
            console.error('Room ID update failed:', error);
        }
    },

    availableRooms: [],
    updateAvailableRooms: () => {
        try {
            console.log('Room list update called');
        } catch (error) {
            console.error('Room list update failed:', error);
        }
    },

    viewerMode: false,
    updateViewerMode: () => {
        try {
            console.log('Viewer mode update called');
        } catch (error) {
            console.error('Viewer mode update failed:', error);
        }
    },

    roomOwner: false,
    updateRoomOwner: () => {
        try {
            console.log('Room owner status update called');
        } catch (error) {
            console.error('Room owner update failed:', error);
        }
    },
};

const GameContext = React.createContext(defaultGameState);

export default GameContext;
