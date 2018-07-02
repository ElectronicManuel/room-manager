declare namespace RoomManager {

    interface HasId {
        _id: string
    }

    interface RoomInCreation {
        name: string
    }

    type Room = RoomInCreation & HasId;

    interface EventInCreation {
        name: string
    }

    type Event = EventInCreation & HasId;

    interface User {
        role: 'admin' | 'user'
    }
}

declare module 'react-firebaseui';