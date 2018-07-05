declare namespace RoomManager {

    interface HasId {
        _id: string
    }

    interface RoomInCreation {
        name: string,
        color: string
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

    type Role = 'User' | 'Verwaltung' | 'Hauswart';

    interface User {
        role: Role,
        displayName: string
    }
}

declare module 'react-firebaseui';