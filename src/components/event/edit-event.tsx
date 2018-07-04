import * as React from 'react'
import { firestore } from '../../firebase';
import { Formik, FormikProps, FormikErrors } from 'formik';
import { Form as SemanticForm, Label, Divider, DropdownItemProps } from 'semantic-ui-react';

import swal from 'sweetalert2';
import autobind from 'autobind-decorator';

type EditEvent = {
    name: string,
    roomId: string,
    abcabc: string
}

type EditEventProps = {
    event: RoomManager.Event | RoomManager.EventInCreation,
    mode: 'create' | 'edit',
    deleteEvent: () => void,
    rooms: RoomManager.Room[]
}

export default class EditEventComp extends React.Component<EditEventProps, any> {
    constructor(props: EditEventProps) {
        super(props);
        console.log('Event: ', props.event);
    }

    @autobind
    getRoom(roomId: string) {
        return this.props.rooms.find((room) => room._id == roomId);
    }

    @autobind
    getRoomOptions() {
        const optionsArray: DropdownItemProps[] = [];
        for(const room of this.props.rooms) {
            optionsArray.push({text: room.name, value: room._id})
        }

        return optionsArray;
    }

    render() {
        return (
            <Formik
                initialValues={{ ...this.props.event }}
                isInitialValid={this.props.mode == 'edit'}
                onSubmit={async (values, actions) => {
                    actions.setSubmitting(true);
                    const { name, roomId } = values;

                    const editEvent = {
                        name,
                        roomId
                    }
                    
                    if(this.props.mode == 'create') {
                        await firestore.collection('events').add(editEvent);
                        swal('Erfolg', 'Event erfolgreich erstellt', 'success');
                    } else if(this.props.mode == 'edit') {
                        await firestore.collection('events').doc((this.props.event as RoomManager.Event)._id).update(editEvent);
                        swal('Erfolg', 'Event erfolgreich bearbeitet', 'success');
                    }

                    actions.setSubmitting(false);
                }}
                validate={(values) => {
                    const { name, roomId } = values;
                    console.log('values', values);
                    let errors: FormikErrors<EditEvent> = {};
                    if(name.length < 2) {
                        errors.name = 'Der Name muss mindestends 2 Zeichen lang sein'
                    }
                    if(!roomId || roomId.length < 5) {
                        errors.roomId = 'Bitte wähle einen Raum';
                    }

                    return errors;
                }}
                render={(formikBag: FormikProps<EditEvent>) => (
                    <SemanticForm onSubmit={formikBag.handleSubmit} loading={formikBag.isSubmitting}>
                        <SemanticForm.Input error={formikBag.errors.name != null} placeholder='Name des Events' name='name' value={formikBag.values.name} onChange={formikBag.handleChange} />
                        {formikBag.errors.name ? <Label pointing color='red'>{formikBag.errors.name}</Label> : null }
                        <SemanticForm.Dropdown selection value={formikBag.values.roomId} onChange={ (e, {value}) => {formikBag.setFieldValue('roomId', value)}} placeholder="Raum" options={this.getRoomOptions()} error={formikBag.errors.roomId != null}></SemanticForm.Dropdown>
                        {formikBag.errors.roomId ? <Label pointing color='red'>{formikBag.errors.roomId}</Label> : null }
                        <Divider />
                        <SemanticForm.Button content={this.props.mode == 'edit' ? 'Bearbeiten' : 'Erstellen'} primary fluid disabled={!formikBag.isValid || formikBag.isSubmitting} loading={formikBag.isSubmitting} />
                        <SemanticForm.Button content='Abbrechen' color='red' fluid onClick={(e) => {e.preventDefault();swal.close()}} />
                        {this.props.mode == 'edit' ? 
                            <div>
                                <Divider />
                                <SemanticForm.Button content='Löschen' color='red' basic fluid onClick={(e) => {e.preventDefault();this.props.deleteEvent()}} icon={'delete'} />
                            </div>
                            :
                            null
                        }
                    </SemanticForm>
                )}
            />
        );
    }
}