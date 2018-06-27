import 'firebase/firestore';
import * as React from 'react';
import * as firebase from 'firebase';
import { StyledFirebaseAuth } from 'react-firebaseui';
import {Container, Header} from 'semantic-ui-react';
import { auth } from 'firebaseui';

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

const uiConfig = {
    signInFlow: 'popup',
    credentialHelper: auth.CredentialHelper.GOOGLE_YOLO,
    signInOptions: [
        firebase.auth.GoogleAuthProvider.PROVIDER_ID,
        firebase.auth.EmailAuthProvider.PROVIDER_ID
    ],
    callbacks: {
        // Avoid redirects after sign-in.
        signInSuccessWithAuthResult: () => false
    }
};

class SignInScreen extends React.Component {
    render() {
        return (
            <Container>
                <Header as='h1'>
                    Room-Manager
                </Header>
                <Header as='h3'>
                    Bitte anmelden
                </Header>
                <StyledFirebaseAuth uiConfig={uiConfig} firebaseAuth={firebase.auth()}/>
            </Container>
        );
    }
}

export {firebase, firestore, SignInScreen}