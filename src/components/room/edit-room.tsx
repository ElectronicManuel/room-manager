import * as React from 'react'
import { firestore } from '../../firebase';
import { Formik, FormikProps, FormikErrors } from 'formik';
import { Form as SemanticForm, Label, Divider } from 'semantic-ui-react';

import swal from 'sweetalert2';

type EditRoom = {
    name: string
}

type EditRoomProps = {
    room: RoomManager.Room | RoomManager.RoomInCreation,
    mode: 'create' | 'edit'
}

export default class EditRoomComp extends React.Component<EditRoomProps, any> {
    constructor(props: EditRoomProps) {
        super(props);
    }

    render() {
        return (
            <Formik
                initialValues={{ name: this.props.room.name }}
                isInitialValid={this.props.mode == 'edit'}
                onSubmit={async (values, actions) => {
                    actions.setSubmitting(true);
                    const { name } = values;
                    
                    if(this.props.mode == 'create') {
                        await firestore.collection('rooms').add({ name });
                        swal('Erfolg', 'Raum erfolgreich erstellt', 'success');
                    } else if(this.props.mode == 'edit') {
                        await firestore.collection('rooms').doc((this.props.room as RoomManager.Room)._id).update({ name });
                        swal('Erfolg', 'Raum erfolgreich bearbeitet', 'success');
                    }

                    actions.setSubmitting(false);
                }}
                validate={(values) => {
                    let errors: FormikErrors<EditRoom> = {};
                    if(values.name.length < 2) {
                        errors.name = 'Der Name muss mindestends 2 Zeichen lang sein'
                    }
                    return errors;
                }}
                render={(formikBag: FormikProps<EditRoom>) => (
                    <SemanticForm onSubmit={formikBag.handleSubmit} loading={formikBag.isSubmitting}>
                        <SemanticForm.Input error={formikBag.errors.name != null} placeholder='Name des Raumes' name='name' value={formikBag.values.name} onChange={formikBag.handleChange} />
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