import * as React from 'react'
import RoomListComponent from './components/room/room-list';
import EventListComponent from './components/event/event-list';
import Calendar from './components/calendar';

import { firestore, firebase } from './firebase';
import { Container, Header, Button, Grid } from 'semantic-ui-react';

type AppState = {
    roomsLoading: boolean,
    eventsLoading: boolean,
    rooms: RoomManager.Room[],
    events: RoomManager.Event[]
}

export default class App extends React.Component<any, AppState> {
    cancelRoomsListener: Function
    cancelEventsListener: Function

    constructor(props: any) {
        super(props);

        this.state = {
            rooms: [],
            events: [],
            roomsLoading: true,
            eventsLoading: true
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
    }

    componentWillUnmount() {
        if(this.cancelRoomsListener) this.cancelRoomsListener();
        if(this.cancelEventsListener) this.cancelEventsListener();
    }

    public render() {
        return (
            <Container>
                <Calendar />
                <Header as='h2'>
                Übersicht
                <Button color='red' floated='right' onClick={() => {firebase.auth().signOut()}}>Abmelden</Button>
                </Header>
                
                <Grid columns={2} stackable centered>
                    <Grid.Column floated='left'>
                        <Header as='h2'>
                            Räume
                        </Header>
                        <RoomListComponent loading={this.state.roomsLoading} rooms={this.state.rooms} setLoading={(loading: boolean) => {this.setState({roomsLoading: loading})}} />
                    </Grid.Column>
                    <Grid.Column floated='right'>
                        <Header as='h2'>
                            Events
                        </Header>
                        <EventListComponent loading={this.state.eventsLoading} events={this.state.events} setLoading={(loading: boolean) => {this.setState({eventsLoading: loading})}} />
                    </Grid.Column>
                </Grid>
            </Container>
            
        )
    }
}
