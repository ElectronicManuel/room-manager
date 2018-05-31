import * as firebase from 'firebase';
import * as React from 'react'

import 'firebase/firestore';

const config = {
    apiKey: "AIzaSyBwGDxjP-as20Fe0Kcm2_IabcW1iAhbo-4",
    authDomain: "room-manage.firebaseapp.com",
    databaseURL: "https://room-manage.firebaseio.com",
    messagingSenderId: "486582388096",
    projectId: "room-manage",
    storageBucket: "room-manage.appspot.com",
};
firebase.initializeApp(config);

const firestore = firebase.firestore();


export default class App extends React.Component<any, { number: number, rooms: any }> {

    constructor(props: any) {
        super(props);


        this.state = {
            number: 0,
            rooms: []
        }

        firestore.collection('rooms').onSnapshot(snapshot => {
            const rooms: any = [];
            snapshot.docs.forEach(room => {
                rooms.push(room.data());
            });
            this.setState({rooms});
        });

    }

    public addNew() {
        firestore.collection('rooms').add({name: 'Room_'+Math.random()});
    }

    public render() {
        const roomList = this.state.rooms.map((room: any) => {
            return (
                <li key={Math.random()}>{room.name}</li>
            )
        });
        return (
            <div>
                Room-Manager
                <ul>
                    {roomList}
                </ul>
                <button onClick={this.addNew}>Add New</button>
            </div>
            
        )
    }
}
