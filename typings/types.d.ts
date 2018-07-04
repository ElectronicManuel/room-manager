declare namespace RoomManager {

    interface HasId {
        _id: string
    }

    interface RoomInCreation {
        name: string,
        color: 'red' | 'blue' | 'green' | 'orange' | 'violet'
    }

    type Room = RoomInCreation & HasId;

    interface EventInCreation {
        name: string
        startDate: Date,
        endDate: Date,
        roomFk: string
    }

    type Event = EventInCreation & HasId;

    interface User {
        role: 'admin' | 'user'
    }
}

declare module 'react-firebaseui';