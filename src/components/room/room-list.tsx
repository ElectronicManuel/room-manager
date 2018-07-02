import * as React from 'react';
import { Divider, Card, Button, Grid, Loader } from 'semantic-ui-react';
import autobind from 'autobind-decorator';
import swal from 'sweetalert2';
import withReactContent, { SweetAlert2, ReactSweetAlert, ReactSweetAlertOptions } from 'sweetalert2-react-content';
import EditRoom from './edit-room';

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
            html: <EditRoom room={{name: ''}} mode='create' />,
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
    deleteRoom(roomId: string) {
        swal('Noch nicht implementiert');
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
                            <Button basic color='red' onClick={() => { this.deleteRoom(room._id) }}>
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