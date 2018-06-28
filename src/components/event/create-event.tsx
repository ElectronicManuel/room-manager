import * as React from 'react'
import { firestore } from '../../firebase';
import { Form } from 'semantic-ui-react';
import swal from 'sweetalert2';

import autobind from 'autobind-decorator';

type CreateEventType = {
    name: string
}

export default class CreateEvent extends React.Component<any, CreateEventType> {
    constructor(props: any) {
        super(props);

        this.state = {
            name: ''
        }

    }

    @autobind
    handleChange(event: any, { name, value }: { name: 'name', value: string }) {
        this.setState({ [name]: value });
    }

    @autobind
    handleSubmit(event: any) {
        const minLength = 2;

        let { name } = this.state;
        if(name.length > minLength) {
            this.setState({
                name: ''
            });
    
            firestore.collection('events').add({name});
        } else {
            swal('Fehler', `Der Name muss mindestens ${minLength} Zeichen haben`, 'error');
        }
    }

    render() {
        const { name } = this.state;

        return (
            <Form onSubmit={this.handleSubmit}>
                <Form.Input placeholder='Name des Events' name='name' value={name} onChange={this.handleChange} />
                <Form.Button content='Hinzufügen' primary fluid />
            </Form>
        );
    } 
}