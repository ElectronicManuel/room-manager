declare namespace RoomManager {
    interface Room {
        name: string,
        _id: string
    }
    
    interface Event {
        name: string,
        _id: string
    }
}

declare module 'react-firebaseui';
declare module 'react-loading-bar';