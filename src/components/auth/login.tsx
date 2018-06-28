import * as React from 'react';
import { SignInScreen, firebase } from '../../firebase';
import { RouteProps, RouteComponentProps, withRouter } from 'react-router';
import { Message, Button } from 'semantic-ui-react';

class LoginComponent extends React.Component<RouteProps & RouteComponentProps<any, any>> {
    render() {
        let user = firebase.auth().currentUser;

        if(user == null) {
            return (
                <SignInScreen history={this.props.history} />
            );
        } else {
            return (
                <div>
                    <div>
                        <Message info>Du bist bereits als <b>{user.displayName}</b> angemeldet</Message>
                        <Button floated='left' primary onClick={() => {this.props.history.push('/')}}>Startseite</Button>
                        <Button color='red' floated='right' onClick={() => {firebase.auth().signOut()}}>Abmelden</Button>
                    </div>
                </div>
            );
        }
    }
}

export default withRouter(LoginComponent);