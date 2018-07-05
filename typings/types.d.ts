declare namespace RoomManager {

    interface HasId {
        _id: string
    }

    interface RoomInCreation {
        name: string,
        color: 'red' | 'blue' | 'green' | 'orange' | 'violet' | 'black'
    }

    type Room = RoomInCreation & HasId & {
        startDate: number,
        endDate: number   
    };

    interface EventInCreation {
        name: string,
        roomId: string,
        startDate?: number,
        endDate?: number
    }

    type Event = EventInCreation & HasId;

    interface User {
        role: 'admin' | 'user'
    }
}

declare module 'react-firebaseui';