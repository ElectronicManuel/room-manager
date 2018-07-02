import * as React from 'react'
import { firestore } from '../../firebase';
import { Formik, FormikProps, FormikErrors } from 'formik';
import { Form as SemanticForm, Label, Divider } from 'semantic-ui-react';

import swal from 'sweetalert2';

type EditEvent = {
    name: string
}

type EditEventProps = {
    event: RoomManager.Event | RoomManager.EventInCreation,
    mode: 'create' | 'edit'
}

export default class EditEventComp extends React.Component<EditEventProps, any> {
    constructor(props: EditEventProps) {
        super(props);
    }

    render() {
        return (
            <Formik
                initialValues={{ name: this.props.event.name }}
                isInitialValid={this.props.mode == 'edit'}
                onSubmit={async (values, actions) => {
                    actions.setSubmitting(true);
                    const { name } = values;
                    
                    if(this.props.mode == 'create') {
                        await firestore.collection('events').add({ name });
                        swal('Erfolg', 'Event erfolgreich erstellt', 'success');
                    } else if(this.props.mode == 'edit') {
                        await firestore.collection('events').doc((this.props.event as RoomManager.Event)._id).update({ name });
                        swal('Erfolg', 'Event erfolgreich bearbeitet', 'success');
                    }

                    actions.setSubmitting(false);
                }}
                validate={(values) => {
                    let errors: FormikErrors<EditEvent> = {};
                    if(values.name.length < 2) {
                        errors.name = 'Der Name muss mindestends 2 Zeichen lang sein'
                    }
                    return errors;
                }}
                render={(formikBag: FormikProps<EditEvent>) => (
                    <SemanticForm onSubmit={formikBag.handleSubmit} loading={formikBag.isSubmitting}>
                        <SemanticForm.Input error={formikBag.errors.name != null} placeholder='Name des Events' name='name' value={formikBag.values.name} onChange={formikBag.handleChange} />
                        {formikBag.errors.name ? <Label pointing color='red'>{formikBag.errors.name}</Label> : null }
                        <Divider />
                        <SemanticForm.Button content={this.props.mode == 'edit' ? 'Bearbeiten' : 'Erstellen'} primary fluid disabled={!formikBag.isValid || formikBag.isSubmitting} loading={formikBag.isSubmitting} />
                        <SemanticForm.Button content='Abbrechen' color='red' fluid onClick={(e) => {e.preventDefault();swal.close()}} />
                    </SemanticForm>
                )}
            />
        );
    }
}