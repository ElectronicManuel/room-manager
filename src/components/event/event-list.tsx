import * as React from 'react';
import EditEvent from './edit-event';
import { Divider, Button, Loader, Grid } from 'semantic-ui-react';
import autobind from 'autobind-decorator';
import swal from 'sweetalert2';
import withReactContent, { SweetAlert2, ReactSweetAlert, ReactSweetAlertOptions } from 'sweetalert2-react-content';
import {firestore} from '../../firebase';

import Calendar from './calendar';

const ReactSwal = withReactContent(swal);

type EventListProps = {
    loading: boolean,
    events: RoomManager.Event[],
    rooms: RoomManager.Room[],
    setLoading: (loading: boolean) => void,
    userDetails: RoomManager.User,
    users: RoomManager.User[]
}

class EventListComponent extends React.Component<EventListProps, {}> {
    constructor(props: EventListProps) {
        super(props);
    }

    @autobind
    async createEvent() {
        (ReactSwal as SweetAlert2 & ReactSweetAlert & { fire: (options: ReactSweetAlertOptions) => any }).fire({
            title: `Event erstellen`,
            html: <EditEvent event={{name: '', roomId: '', startDate: undefined, endDate: undefined, userId: ''}} mode='create' deleteEvent={() => {}} rooms={this.props.rooms} userDetails={this.props.userDetails} users={this.props.users}/>,
            showConfirmButton: false
        });
    }

    @autobind
    async editEvent(event: RoomManager.Event) {
        (ReactSwal as SweetAlert2 & ReactSweetAlert & { fire: (options: ReactSweetAlertOptions) => any }).fire({
            title: `Event '${event.name}' bearbeiten`,
            html: <EditEvent event={event} mode='edit' deleteEvent={() => {this.deleteEvent(event)}} rooms={this.props.rooms} userDetails={this.props.userDetails} users={this.props.users}/>,
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
        return (
            <div>
                {
                    this.props.userDetails.role != 'Hauswart' ?
                        <Button onClick={() => {this.createEvent()}} fluid primary>Neues Event</Button>
                        :
                        null
                }
                <Divider />
                <Grid centered padded>
                    <Loader inline active={this.props.loading} indeterminate>
                        Lade Events
                    </Loader>
                </Grid>
                {
                    !this.props.loading ? <Calendar events={this.props.events} editEvent={this.editEvent} deleteEvent={this.deleteEvent} rooms={this.props.rooms} /> : null
                }
            </div>
        );
    }
}

export default EventListComponent;