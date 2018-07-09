import * as React from 'react'
import RoomListComponent from './components/room/room-list';
import EventOverview from './components/event/event-overview';

import { firestore } from './firebase';
import { Container, Message } from 'semantic-ui-react';
import UserListComponent from './components/users/user-list';
import { Switch, Route } from 'react-router';

type AppProps = {
    userDetails: RoomManager.User
}

type AppState = {
    rooms: RoomManager.Room[],
    events: RoomManager.Event[],
    users: RoomManager.UserWithId[],
    roomsLoading: boolean,
    eventsLoading: boolean,
    usersLoading: boolean
}

export default class App extends React.Component<AppProps, AppState> {
    cancelRoomsListener: () => any
    cancelEventsListener: () => any
    cancelUsersListener: () => any

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
            const users: RoomManager.UserWithId[] = [];
            snapshot.docs.forEach(user => {
                users.push(({...user.data(), _id: user.id} as RoomManager.UserWithId));
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
                <Switch>
                    <Route path='/users' render={() => {
                        if(this.props.userDetails.role === 'Verwaltung') {
                            return <UserListComponent loading={this.state.usersLoading} users={this.state.users} setLoading={(loading: boolean) => {this.setState({usersLoading: loading})}} />;
                        } else {
                            return <Message error>Du darfst diese Seite nicht ansehen.</Message>
                        }
                    }} />
                    <Route path='/rooms' render={() => {
                        if(this.props.userDetails.role === 'Verwaltung') {
                            return <RoomListComponent loading={this.state.roomsLoading} rooms={this.state.rooms} setLoading={(loading: boolean) => {this.setState({roomsLoading: loading})}} />
                        } else {
                            return <Message error>Du darfst diese Seite nicht ansehen.</Message>
                        }
                    }} />
                    <Route path='/events' render={() => {
                        if(this.props.userDetails.role === 'Verwaltung' || this.props.userDetails.role === 'Hauswart') {
                            return <EventOverview mode='list' loading={this.state.eventsLoading} events={this.state.events} setLoading={(loading: boolean) => {this.setState({eventsLoading: loading})}} rooms={this.state.rooms} userDetails={this.props.userDetails} users={this.state.users} /> 
                        } else {
                            return <Message error>Du darfst diese Seite nicht ansehen.</Message>
                        }
                    }} />
                    <Route path='/' render={() => (
                        <EventOverview mode='overview' loading={this.state.eventsLoading} events={this.state.events} setLoading={(loading: boolean) => {this.setState({eventsLoading: loading})}} rooms={this.state.rooms} userDetails={this.props.userDetails} users={this.state.users} />                     
                    )} />
                     
                </Switch>
            </Container>
            
        )
    }
}
