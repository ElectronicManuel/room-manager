declare namespace RoomManager {

    interface HasId {
        _id: string
    }

    interface RoomInCreation {
        name: string,
        color: string,
        description: string,
    }

    type Room = RoomInCreation & HasId & {
        startDate: number,
        endDate: number   
    };

    interface EventInCreation {
        name: string,
        roomId: string,
        description: string,
        startDate?: number,
        endDate?: number,
        userId: string
    }

    type Event = EventInCreation & HasId;

    type Role = 'User' | 'Verwaltung' | 'Hauswart';

    interface User {
        _id?: string,
        role: Role,
        displayName: string,
        photo?: string
    }

    type UserWithId = User & HasId;
}

declare module 'react-firebaseui';