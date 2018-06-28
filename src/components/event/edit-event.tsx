import * as React from 'react'
import { firestore } from '../../firebase';
import { Formik, FormikProps, FormikErrors } from 'formik';
import { Form as SemanticForm, Label, Divider, Loader } from 'semantic-ui-react';

import swal from 'sweetalert2';

type EditEvent = {
    name: string
}

type EditEventProps = {
    event: RoomManager.Event,
    mode: 'create' | 'edit'
}

export default class CreateEvent extends React.Component<EditEventProps, any> {
    constructor(props: EditEventProps) {
        super(props);
    }

    render() {
        return (
            <Formik
                initialValues={{ name: this.props.event.name }}
                isInitialValid={true}
                onSubmit={async (values, actions) => {
                    actions.setSubmitting(true);
                    const { name } = values;
                    await firestore.collection('events').doc(this.props.event._id).update({ name });
                    actions.setSubmitting(false);
                    swal('Erfolg', 'Event erfolgreich bearbeitet', 'success');
                }}
                validate={(values) => {
                    let errors: FormikErrors<EditEvent> = {};
                    if(values.name.length < 2) {
                        errors.name = 'Der Name muss mindestends 2 Zeichen lang sein'
                    }
                    return errors;
                }}
                render={(formikBag: FormikProps<EditEvent>) => (
                    <SemanticForm onSubmit={formikBag.handleSubmit}>
                        <Loader active={formikBag.isSubmitting} />
                        <SemanticForm.Input error={formikBag.errors.name != null} placeholder='Name des Events' name='name' value={formikBag.values.name} onChange={formikBag.handleChange} />
                        {formikBag.errors.name ? <Label pointing color='red'>{formikBag.errors.name}</Label> : null }
                        <Divider />
                        <SemanticForm.Button content='Bearbeiten' primary fluid disabled={!formikBag.isValid || formikBag.isSubmitting} />
                        <SemanticForm.Button content='Abbrechen' color='red' fluid onClick={(e) => {e.preventDefault();swal.close()}} />
                    </SemanticForm>
                )}
            />
        );
    }
}