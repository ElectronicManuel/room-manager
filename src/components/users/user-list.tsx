import * as React from 'react';
import { Card, Grid, Loader, Message, Form, Divider, InputOnChangeData } from 'semantic-ui-react';
import UserDetail from './user-detail';
import autobind from 'autobind-decorator';

type UserListProps = {
    loading: boolean,
    setLoading: (loading: boolean) => void,
    users: RoomManager.UserWithId[]
}

type UserListState = {
    filter: string
}

class UserListComponent extends React.Component<UserListProps, UserListState> {

    constructor(props) {
        super(props);

        this.state = {
            filter: ''
        }
    }

    @autobind
    handleChange(e, data: InputOnChangeData) {
        this.setState({filter: data.value});
    }

    @autobind
    handleClear() {
        if(this.state.filter.length > 0) {
            this.setState({filter: ''});
        }
    }

    render() {
        const filteredUsers = this.props.users.filter(user => {
            return user.displayName.toLowerCase().indexOf(this.state.filter.toLowerCase()) != -1;
        });
        let userList: JSX.Element | JSX.Element[] = (
            <Message>
                Keine Benutzer gefunden
            </Message>
        );

        if(filteredUsers.length > 0) {
            userList = filteredUsers.map((user: RoomManager.UserWithId) => {
                return (
                    <UserDetail user={user} key={user._id} />
                )
            });
        }

        return (
            <div>
                <Form.Input value={this.state.filter} onChange={this.handleChange} placeholder='Suche nach Benutzern' fluid icon={{name: this.state.filter.length == 0 ? 'search' : 'close', onClick: this.handleClear, link: true}} />
                <Divider />
                <Grid centered padded>
                    <Loader inline active={this.props.loading} indeterminate>
                        Lade Benutzer
                    </Loader>
                </Grid>

                <Card.Group doubling stackable itemsPerRow={3}>
                    {userList}
                </Card.Group>
            </div>
        );
    }
}

export default UserListComponent;