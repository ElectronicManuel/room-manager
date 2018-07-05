import * as React from 'react'
import RoomListComponent from './components/room/room-list';
import EventListComponent from './components/event/event-list';

import { firestore } from './firebase';
import { Container, Header } from 'semantic-ui-react';

type AppProps = {
    userDetails: RoomManager.User
}

type AppState = {
    roomsLoading: boolean,
    eventsLoading: boolean,
    usersLoading: boolean,
    rooms: RoomManager.Room[],
    events: RoomManager.Event[],
    users: RoomManager.User[]
}

export default class App extends React.Component<AppProps, AppState> {
    cancelRoomsListener: Function
    cancelEventsListener: Function
    cancelUsersListener: Function

    constructor(props: any) {
        super(props);

        this.state = {
            rooms: [],
            events: [],
            users: [],
            roomsLoading: true,
            eventsLoading: true,
            usersLoading: true
        }
    }

    componentWillMount() {
        this.cancelRoomsListener = firestore.collection('rooms').onSnapshot(snapshot => {
            const rooms: RoomManager.Room[] = [];
            snapshot.docs.forEach(room => {
                rooms.push(({...room.data(), _id: room.id} as RoomManager.Room));
            });
            this.setState({rooms, roomsLoading: false});
        });

        this.cancelEventsListener = firestore.collection('events').onSnapshot(snapshot => {
            const events: RoomManager.Event[] = [];
            snapshot.docs.forEach(event => {
                events.push(({...event.data(), _id: event.id} as RoomManager.Event));
            });
            this.setState({events, eventsLoading: false});
        });
        this.cancelUsersListener = firestore.collection('users').onSnapshot(snapshot => {
            const users: RoomManager.User[] = [];
            snapshot.docs.forEach(user => {
                users.push(({...user.data(), _id: user.id} as RoomManager.User));
            });
            this.setState({users, usersLoading: false});
        });
    }

    componentWillUnmount() {
        if(this.cancelRoomsListener) this.cancelRoomsListener();
        if(this.cancelEventsListener) this.cancelEventsListener();
        if(this.cancelUsersListener) this.cancelUsersListener();
    }

    public render() {
        return (
            <Container>
                <Header as='h2'>
                Übersicht
                </Header>
                
                <Header as='h2'>
                    Events
                </Header>
                <EventListComponent loading={this.state.eventsLoading} events={this.state.events} setLoading={(loading: boolean) => {this.setState({eventsLoading: loading})}} rooms={this.state.rooms} userDetails={this.props.userDetails} users={this.state.users} />

                {this.props.userDetails.role == 'Verwaltung' ? 
                    <div>
                        <Header as='h2'>
                            Räume
                        </Header>
                        <RoomListComponent loading={this.state.roomsLoading} rooms={this.state.rooms} setLoading={(loading: boolean) => {this.setState({roomsLoading: loading})}} />
                    </div>
                : null}
            </Container>
            
        )
    }
}
