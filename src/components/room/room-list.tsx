import * as React from 'react';
import CreateRoom from './create-room';
import { Divider, Card, Button } from 'semantic-ui-react';
import autobind from 'autobind-decorator';
import swal from 'sweetalert2';
import { firestore } from '../../firebase';

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
    async editRoom(room: RoomManager.Room) {
        const { value: name } = await swal({
            title: `Raum ${room.name} bearbeiten`,
            input: 'text',
            inputPlaceholder: 'Name des Raumes',
            showCancelButton: true,
            inputValue: room.name,
            inputValidator: (value: string): any => {
                if (!value || value.length < 2) {
                    return 'Der Name muss mindestends 2 Zeichen lang sein';
                }
                return null;
            }
        });

        this.props.setLoading(true);

        if (name) {
            try {
                await firestore.collection('rooms').doc(room._id).update({ name });
                swal('Erfolg', 'Raum bearbeitet', 'success');
            } catch (err) {
                console.error('Fehler beim Updaten in Firebase', err);
                swal('Fehler', 'Feuer! Feuer!', 'error');
            }
        }
        this.props.setLoading(false);
    }

    @autobind
    deleteRoom(roomId: string) {
        swal('Noch nicht implementiert');
    }

    render() {
        const roomList = this.props.rooms.map((room: RoomManager.Room) => {
            return (
                <Card key={room._id}>
                    <Card.Content>
                        <Card.Header>{room.name}</Card.Header>
                    </Card.Content>
                    <Card.Content extra>
                        <div className='ui two buttons'>
                            <Button basic primary onClick={() => { this.editRoom(room) }}>
                                Bearbeiten
                        </Button>
                            <Button basic color='red' onClick={() => { this.deleteRoom(room._id) }}>
                                Löschen
                        </Button>
                        </div>
                    </Card.Content>
                </Card>
            )
        });

        return (
            <div>
                <CreateRoom />
                <Divider />
                {
                    this.props.loading ?
                        <p>Loading</p>
                        :
                        <Card.Group stackable>
                            {roomList}
                        </Card.Group>
                }
            </div>
        );
    }
}

export default RoomListComponent;