import * as React from 'react';
import { Card, Image, Dropdown, InputOnChangeData, SemanticCOLORS } from 'semantic-ui-react';
import autobind from 'autobind-decorator';
import { firestore, firebase } from '../../firebase';

const roleOptions = [
    {
        text: 'Hauswart',
        value: 'hauswart'
    },
    {
        text: 'User',
        value: 'user'
    },
    {
        text: 'Verwaltung',
        value: 'verwaltung'
    }
]

type UserDetailProps = {
    user: RoomManager.UserWithId
}

type UserDetailState = {
    loading: boolean
}

class UserDetail extends React.Component<UserDetailProps, UserDetailState> {
    constructor(props) {
        super(props);
        
        this.state = {
            loading: false
        }
    }

    @autobind
    getColor() {
        let color: SemanticCOLORS = 'red';
        
        switch(this.props.user.role.toLowerCase()) {
            case 'hauswart':
                color = 'teal';
                break;
            case 'user':
                color = 'green';
                break;
            case 'verwaltung':
                color = 'orange';
                break;
            default:
        }

        return color;
    }

    @autobind
    async handleChange(e, data: InputOnChangeData) {
        const newRole = data.value;

        this.setState({loading: true});

        await firestore.collection('users').doc(this.props.user._id).update({role: newRole});

        this.setState({loading: false});
    }

    render() {
        const isSelf = firebase.auth().currentUser != null ? (firebase.auth().currentUser as firebase.User).uid == this.props.user._id : false;
        return (
            <Card color={this.getColor()} className={isSelf ? 'user-self' : ''} fluid>
                <Card.Content>
                    <Image src={this.props.user.photo ? this.props.user.photo : 'https://react.semantic-ui.com/images/avatar/large/matthew.png'} className='user-photo' avatar floated='right' />
                    <Card.Header>
                        {this.props.user.displayName}
                    </Card.Header>
                    <Card.Description>
                        Rolle: <Dropdown onChange={this.handleChange} options={roleOptions} value={this.props.user.role} loading={this.state.loading} disabled={this.state.loading} />
                    </Card.Description>
                </Card.Content>
                <Card.Content extra>
                    ID: {this.props.user._id}
                </Card.Content>
            </Card>
        );
    }
}

export default UserDetail;