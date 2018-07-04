import * as React from 'react';
import EditEvent from './edit-event';
import { Divider, Card, Button, Loader, Grid } from 'semantic-ui-react';
import autobind from 'autobind-decorator';
import swal from 'sweetalert2';
import withReactContent, { SweetAlert2, ReactSweetAlert, ReactSweetAlertOptions } from 'sweetalert2-react-content';
import {firestore} from '../../firebase';

const ReactSwal = withReactContent(swal);

type EventListProps = {
    loading: boolean,
    events: RoomManager.Event[],
    setLoading: (loading: boolean) => void
}

class EventListComponent extends React.Component<EventListProps, {}> {
    constructor(props: EventListProps) {
        super(props);
    }

    @autobind
    async createEvent() {
        (ReactSwal as SweetAlert2 & ReactSweetAlert & { fire: (options: ReactSweetAlertOptions) => any }).fire({
            title: `Event erstellen`,
            html: <EditEvent event={{name: ''}} mode='create' />,
            showConfirmButton: false
        });
    }

    @autobind
    async editEvent(event: RoomManager.Event) {
        (ReactSwal as SweetAlert2 & ReactSweetAlert & { fire: (options: ReactSweetAlertOptions) => any }).fire({
            title: `Event '${event.name}' bearbeiten`,
            html: <EditEvent event={event} mode='edit' />,
            showConfirmButton: false
        });
    }

    @autobind
    async deleteEvent(event: RoomManager.Event) {
        const result = await swal({
            title: `Möchtest du wirklich das Event ${event.name} löschen?`,
            text: "Es kann nicht rückgängig gemacht werden!",
            type: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Ja, löschen!'
          });
          
        if (result.value) {
            try
            {
            await firestore.collection('events').doc(event._id).delete();
            swal(
                'Gelöscht!',
                'Das Event wurde erfolgreich gelöscht.',
                'success'
                )
            }
            catch(err){
                console.error('Fehler beim Löschen', err);
                swal(
                    'Fehler beim Löschen des Events'
                )
            }           
        }
    }

    render() {
        const eventList = this.props.events.map((event) => {
            return (
                <Card key={event._id} fluid>
                    <Card.Content>
                        <Card.Header>{event.name}</Card.Header>
                    </Card.Content>
                    <Card.Content extra>
                        <Button.Group fluid>
                            <Button basic primary onClick={() => { this.editEvent(event) }}>
                                Bearbeiten
                            </Button>
                            <Button basic color='red' onClick={() => { this.deleteEvent(event) }}>
                                Löschen
                            </Button>
                        </Button.Group>
                    </Card.Content>
                </Card>
            )
        });

        return (
            <div>
                <Button onClick={() => {this.createEvent()}} fluid primary>Neues Event</Button>
                <Divider />
                <Grid centered padded>
                    <Loader inline active={this.props.loading} indeterminate>
                        Lade Events
                    </Loader>
                </Grid>
                <Card.Group stackable>
                    {eventList}
                </Card.Group>
            </div>
        );
    }
}

export default EventListComponent;