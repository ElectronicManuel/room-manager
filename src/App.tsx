import * as React from 'react'
import CreateRoom from './components/create-room';
import CreateEvent from './components/create-event';
import { firestore, firebase } from './firebase';
import { Container, Header, Card, Divider, Loader, Button, Grid } from 'semantic-ui-react';
import swal from 'sweetalert2';

import 'semantic-ui-css/semantic.min.css';
import autobind from 'autobind-decorator';

type AppState = {
    number: number,
    loading: boolean,
    rooms: RoomManager.Room[],
    events: RoomManager.Event[],
    user?: firebase.User,
    userLoading: boolean
}

export default class App extends React.Component<any, AppState> {
    constructor(props: any) {
        super(props);

        this.state = {
            number: 0,
            rooms: [],
            events: [],
            user: undefined,
            loading: true,
            userLoading : true
        }

        firebase.auth().onAuthStateChanged((user: firebase.User) => {
            this.setState({user, userLoading: false});
        });

        firestore.collection('rooms').onSnapshot(snapshot => {
            const rooms: RoomManager.Room[] = [];
            snapshot.docs.forEach(room => {
                
                rooms.push(({...room.data(), _id: room.id} as RoomManager.Room));
            });
            this.setState({rooms, loading: false});
        });

        firestore.collection('events').onSnapshot(snapshot => {
            const events: RoomManager.Event[] = [];
            snapshot.docs.forEach(event => {
                events.push(({...event.data(), _id: event.id} as RoomManager.Event));
            });
            this.setState({events, loading: false});
        });

    }

    @autobind
    async editRoom(room: RoomManager.Room) {
        const { value: name } = await swal({
            title: `Raum ${room.name} bearbeiten`,
            input: 'text',
            inputPlaceholder: 'Name des Raumes',
            showCancelButton: true,
            inputValue: room.name,
            inputValidator: (value: string): any => {
                if(!value || value.length < 2) {
                    return 'Der Name muss mindestends 2 Zeichen lang sein';
                }
                return null;
            }
        });

        this.setState({loading: true});

        if(name) {
            try {
                await firestore.collection('rooms').doc(room._id).update({name});
                swal('Erfolg', 'Raum bearbeitet', 'success');
            } catch(err) {
                console.error('Fehler beim Updaten in Firebase', err);
                swal('Fehler', 'Feuer! Feuer!', 'error');
            }
        } else {
            swal('Fehler', 'Etwas ist schief gelaufen...', 'error');
        }
        this.setState({loading: false});
    }

    @autobind
    deleteRoom(roomId: string) {
        swal('Noch nicht implementiert');
    }

    @autobind
    async editEvent(event: RoomManager.Event) {
        const { value: name } = await swal({
            title: `Event ${event.name} bearbeiten`,
            input: 'text',
            inputPlaceholder: 'Name des Events',
            showCancelButton: true,
            inputValue: event.name,
            inputValidator: (value: string): any => {
                if(!value || value.length < 2) {
                    return 'Der Name muss mindestends 2 Zeichen lang sein';
                }
                return null;
            }
        });

        this.setState({loading: true});

        if(name) {
            try {
                await firestore.collection('events').doc(event._id).update({name});
                swal('Erfolg', 'Event bearbeitet', 'success');
            } catch(err) {
                console.error('Fehler beim Updaten in Firebase', err);
                swal('Fehler', 'Feuer! Feuer!', 'error');
            }
        } else {
            swal('Fehler', 'Etwas ist schief gelaufen...', 'error');
        }
        this.setState({loading: false});
    }

    @autobind
    deleteEvent(eventId: string) {
        swal('Noch nicht implementiert');
    }

    public render() {
        if(this.state.userLoading) {
            return <Loader indeterminate /> 
        }

        const roomList = this.state.rooms.map((room: RoomManager.Room) => {
            return (
                <Card key={room._id}>
                    <Card.Content>
                        <Card.Header>{room.name}</Card.Header>
                    </Card.Content>
                    <Card.Content extra>
                        <div className='ui two buttons'>
                        <Button basic primary onClick={() => {this.editRoom(room)}}>
                            Bearbeiten
                        </Button>
                        <Button basic color='red' onClick={() => {this.deleteRoom(room._id)}}>
                            Löschen
                        </Button>
                        </div>
                    </Card.Content>
                </Card>
            )
        });

        const eventList = this.state.events.map((event) => {
            return (
                <Card key={event._id}>
                    <Card.Content>
                        <Card.Header>{event.name}</Card.Header>
                    </Card.Content>
                    <Card.Content extra>
                        <div className='ui two buttons'>
                        <Button basic primary onClick={() => {this.editEvent(event)}}>
                            Bearbeiten
                        </Button>
                        <Button basic color='red' onClick={() => {this.deleteEvent(event._id)}}>
                            Löschen
                        </Button>
                        </div>
                    </Card.Content>
                </Card>
            )
        });

        return (
            <Container>
                <Loader active={this.state.loading} />
                <Header as='h1'>
                Room-Manager
                <Button color='red' floated='right' onClick={() => {firebase.auth().signOut()}}>Abmelden</Button>
                </Header>
                
                <Grid columns={2} stackable>
                    <Grid.Column floated='left'>
                        <Header as='h2'>
                            Räume
                        </Header>
                        <CreateRoom />
                        <Divider />
                        <Card.Group stackable>
                            {roomList}
                        </Card.Group>
                    </Grid.Column>
                    <Grid.Column floated='right'>
                        <Header as='h2'>
                            Events
                        </Header>
                        <CreateEvent />
                        <Divider />
                        <Card.Group stackable>
                            {eventList}
                        </Card.Group>
                    </Grid.Column>
                </Grid>
            </Container>
            
        )
    }
}
