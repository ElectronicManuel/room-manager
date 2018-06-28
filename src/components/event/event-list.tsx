import * as React from 'react';
import CreateEvent from './create-event';
//import EditEvent from './edit-event';
import { Divider, Card, Button } from 'semantic-ui-react';
import autobind from 'autobind-decorator';
import swal from 'sweetalert2';
//import withReactContent, { SweetAlert2, ReactSweetAlert, ReactSweetAlertOptions } from 'sweetalert2-react-content';
import { firestore } from '../../firebase';

//const ReactSwal = withReactContent(swal);

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
    async editEvent(event: RoomManager.Event) {
        /*(ReactSwal as SweetAlert2 & ReactSweetAlert & {fire: (options: ReactSweetAlertOptions) => any}).fire({
            title: `Event '${event.name}' bearbeiten`,
            html: <EditEvent setLoading={this.props.setLoading} event={event} />
        });*/
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

        this.props.setLoading(true);

        if(name) {
            try {
                await firestore.collection('events').doc(event._id).update({name});
                swal('Erfolg', 'Event bearbeitet', 'success');
            } catch(err) {
                console.error('Fehler beim Updaten in Firebase', err);
                swal('Fehler', 'Feuer! Feuer!', 'error');
            }
        }
        this.props.setLoading(false);
    }

    @autobind
    deleteEvent(eventId: string) {
        swal('Noch nicht implementiert');
    }

    render() {
        const eventList = this.props.events.map((event) => {
            return (
                <Card key={event._id}>
                    <Card.Content>
                        <Card.Header>{event.name}</Card.Header>
                    </Card.Content>
                    <Card.Content extra>
                        <div className='ui two buttons'>
                            <Button basic primary onClick={() => { this.editEvent(event) }}>
                                Bearbeiten
                        </Button>
                            <Button basic color='red' onClick={() => { this.deleteEvent(event._id) }}>
                                Löschen
                        </Button>
                        </div>
                    </Card.Content>
                </Card>
            )
        });

        return (
            <div>
                <CreateEvent />
                <Divider />
                {
                    this.props.loading ?
                        <p>Loading</p>
                        :
                        <Card.Group stackable>
                            {eventList}
                        </Card.Group>
                }
            </div>
        );
    }
}

export default EventListComponent;