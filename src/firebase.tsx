import 'firebase/firestore';
import * as React from 'react';
import * as firebase from 'firebase';
import { StyledFirebaseAuth } from 'react-firebaseui';
import { Header} from 'semantic-ui-react';
import { auth } from 'firebaseui';
import { History } from 'history';

const config = {
    apiKey: "AIzaSyBwGDxjP-as20Fe0Kcm2_IabcW1iAhbo-4",
    authDomain: "room-manage.firebaseapp.com",
    databaseURL: "https://room-manage.firebaseio.com",
    messagingSenderId: "486582388096",
    projectId: "room-manage",
    storageBucket: "room-manage.appspot.com"
};
firebase.initializeApp(config);

const firestore = firebase.firestore();
firestore.settings({timestampsInSnapshots: true});

class SignInScreen extends React.Component<{
    history: History
}, {
    uiConfig: object
}> {
    constructor(props) {
        super(props);
        this.state = {
            uiConfig: {
                signInFlow: 'popup',
                credentialHelper: auth.CredentialHelper.GOOGLE_YOLO,
                signInOptions: [
                    firebase.auth.GoogleAuthProvider.PROVIDER_ID,
                    firebase.auth.EmailAuthProvider.PROVIDER_ID
                ],
                callbacks: {
                    // Avoid redirects after sign-in.
                    signInSuccessWithAuthResult: () => {
                        this.props.history.push('/')
                        return false;
                    }
                }
            }
        }
    }

    render() {
        return (
            <div>
                <Header as='h3' style={{textAlign: 'center'}}>
                    Bitte anmelden
                </Header>
                <StyledFirebaseAuth uiConfig={this.state.uiConfig} firebaseAuth={firebase.auth()}/>
            </div>
        );
    }
}

export {firebase, firestore, SignInScreen}