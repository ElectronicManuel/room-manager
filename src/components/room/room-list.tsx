import * as React from 'react';
import { Divider, Card, Button, Grid, Loader } from 'semantic-ui-react';
import autobind from 'autobind-decorator';
import swal from 'sweetalert2';
import withReactContent, { SweetAlert2, ReactSweetAlert, ReactSweetAlertOptions } from 'sweetalert2-react-content';
import EditRoom from './edit-room';
import {firestore} from '../../firebase';

const ReactSwal = withReactContent(swal);

type RoomListProps = {
    loading: boolean,
    rooms: RoomManager.Room[],
    setLoading: (loading: boolean) => void
}

class RoomListComponent extends React.Component<RoomListProps, {}> {
    constructor(props: RoomListProps) {
        super(props);
    }

    @autobind
    async createRoom() {
        (ReactSwal as SweetAlert2 & ReactSweetAlert & { fire: (options: ReactSweetAlertOptions) => any }).fire({
            title: `Raum erstellen`,
            html: <EditRoom room={{name: '', color:'red'}} mode='create' />,
            showConfirmButton: false
        });
    }

    @autobind
    async editRoom(room: RoomManager.Room) {
        (ReactSwal as SweetAlert2 & ReactSweetAlert & { fire: (options: ReactSweetAlertOptions) => any }).fire({
            title: `Raum bearbeiten`,
            html: <EditRoom room={room} mode='edit' />,
            showConfirmButton: false
        });
    }

    @autobind
    async deleteRoom(room: RoomManager.Room) {
        const result = await swal({
            title: `Möchtest du wirklich den Raum ${room.name} löschen?`,
            text: "Es kann nicht rückgängig gemacht werden!",
            type: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Ja, löschen!'
          });
          
        if (result.value) {
            try
            {
            await firestore.collection('rooms').doc(room._id).delete();
            swal(
                'Gelöscht!',
                'Der Raum wurde erfolgreich gelöscht.',
                'success'
                )
            }
            catch(err){
                console.error('Fehler beim Löschen', err);
                swal(
                    'Fehler beim Löschen des Raums'
                )
            }           
        }
    }

    render() {
        const roomList = this.props.rooms.map((room: RoomManager.Room) => {
            return (
                <Card key={room._id} fluid>
                    <Card.Content>
                        <Card.Header>{room.name}</Card.Header>
                    </Card.Content>
                    <Card.Content extra>
                        <Button.Group fluid>
                            <Button basic primary onClick={() => { this.editRoom(room) }}>
                                Bearbeiten
                            </Button>
                            <Button basic color='red' onClick={() => { this.deleteRoom(room) }}>
                                Löschen
                            </Button>
                        </Button.Group>
                    </Card.Content>
                </Card>
            )
        });

        return (
            <div>
                <Button onClick={() => {this.createRoom()}} fluid primary>Neuer Raum</Button>
                <Divider />
                
                <Grid centered padded>
                    <Loader inline active={this.props.loading} indeterminate>
                        Lade Räume
                    </Loader>
                </Grid>

                <Card.Group stackable>
                    {roomList}
                </Card.Group>
            </div>
        );
    }
}

export default RoomListComponent;