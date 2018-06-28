import * as React from 'react'
import { firestore } from '../../firebase';
import { Formik, FormikProps, FormikErrors } from 'formik';
import { Form as SemanticForm } from 'semantic-ui-react';

import autobind from 'autobind-decorator';

type EditEventState = {
    name: string
}

type EditEventProps = {
    setLoading: (loading: boolean) => void,
    event: RoomManager.Event
}

export default class CreateEvent extends React.Component<EditEventProps, EditEventState> {
    constructor(props: EditEventProps) {
        super(props);

        this.state = {
            name: this.props.event.name
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
        if (name.length > minLength) {
            firestore.collection('events').doc(this.props.event._id).update({ name });
        } else {
        }
    }

    render() {
        return (
            <Formik
                initialValues={{ name: this.props.event.name }}
                isInitialValid={true}
                onSubmit={(values) => {
                    console.log('Submitted: ', values);
                }}
                validate={(values) => {
                    let errors: FormikErrors<EditEventState> = {};
                    if(values.name.length < 2) {
                        errors.name = 'Der Name muss mindestends 2 Zeichen lang sein'
                    }
                    return errors;
                }}
                render={(formikBag: FormikProps<EditEventState>) => (
                    <SemanticForm onSubmit={formikBag.handleSubmit}>
                        <SemanticForm.Input error={formikBag.errors.name != null} placeholder='Name des Events' name='name' value={formikBag.values.name} onChange={formikBag.handleChange} />
                        <SemanticForm.Button content='Bearbeiten' primary fluid disabled={!formikBag.isValid} />
                    </SemanticForm>
                )}
            />
        );
    }
}