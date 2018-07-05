import * as React from 'react'
import { firestore } from '../../firebase';
import { Formik, FormikProps, FormikErrors } from 'formik';
import { Form as SemanticForm, Label, Divider } from 'semantic-ui-react';

import swal from 'sweetalert2';

type EditRoom = RoomManager.RoomInCreation;

type EditRoomProps = {
    room: RoomManager.Room | RoomManager.RoomInCreation,
    mode: 'create' | 'edit'
}

type ColorDefinition = {
    name: string,
    colorValue: string
}

const colorDefinition: ColorDefinition[] = [
    {
        name: 'Echtes Blau',
        colorValue: '#97DBED'
    },
    {
        name: 'Parakeet Grün',
        colorValue: '#7AB55C'
    },
    {
        name: 'Pink',
        colorValue: '#FAC8BF'
    },
    {
        name: 'Coral orange',
        colorValue: '#FF7F50'
    },
    {
        name: 'Plumet',
        colorValue: '#Dda0dd'
    },
    {
        name: 'Dimgrau',
        colorValue: '#696969'
    },
    {
        name: 'Hellgrau',
        colorValue: '#3C7A89'
    },
    {
        name: 'Dunkelblau',
        colorValue: '#150578'
    }
]

const colors = ((colorDefinitions: ColorDefinition[]) => {
    const colorArray: any[] = [];
    
    for(const c of colorDefinitions) {
        colorArray.push({
            text: <div style={{color: c.colorValue}}>{c.name}</div>,
            value: c.colorValue
        });
    }

    return colorArray;
})(colorDefinition)


export default class EditRoomComp extends React.Component<EditRoomProps, any> {
    constructor(props: EditRoomProps) {
        super(props);
    }

    render() {
        return (
            <Formik
                initialValues={{ ...this.props.room }}
                isInitialValid={this.props.mode == 'edit'}
                onSubmit={async (values, actions) => {
                    actions.setSubmitting(true);
                    const { name, color } = values;
                    
                    const editedRoom = { name, color };
                    console.log('edited room: ', editedRoom);

                    if(this.props.mode == 'create') {
                        await firestore.collection('rooms').add(editedRoom);
                        swal('Erfolg', 'Raum erfolgreich erstellt', 'success');
                    } else if(this.props.mode == 'edit') {
                        await firestore.collection('rooms').doc((this.props.room as RoomManager.Room)._id).update(editedRoom);
                        swal('Erfolg', 'Raum erfolgreich bearbeitet', 'success');
                    }

                    actions.setSubmitting(false);
                }}
                validate={({name, color}) => {
                    let errors: FormikErrors<EditRoom> = {};
                    if(name.length < 2) {
                        errors.name = 'Der Name muss mindestends 2 Zeichen lang sein'
                    }
                    if(!color) {
                        errors.color = 'Du musst eine Farbe auswählen';
                    }
                    return errors;
                }}
                render={(formikBag: FormikProps<EditRoom>) => (
                    <SemanticForm onSubmit={formikBag.handleSubmit} loading={formikBag.isSubmitting}>
                        <SemanticForm.Input label='Name' placeholder='Name des Raumes' name='name' value={formikBag.values.name} onChange={formikBag.handleChange} error={formikBag.errors.name != null} />
                        {formikBag.errors.name ? <Label pointing color='red'>{formikBag.errors.name}</Label> : null }
                        <SemanticForm.Dropdown label='Farbe' selection value={formikBag.values.color} onChange={ (e, {value}) => {formikBag.setFieldValue('color', value)}} placeholder="Farbe" options={colors} error={formikBag.errors.color != null}></SemanticForm.Dropdown>
                        {formikBag.errors.color ? <Label pointing color='red'>{formikBag.errors.color}</Label> : null }
                        <Divider />
                        <SemanticForm.Button content={this.props.mode == 'edit' ? 'Bearbeiten' : 'Erstellen'} primary fluid disabled={!formikBag.isValid || formikBag.isSubmitting} loading={formikBag.isSubmitting} />
                        <SemanticForm.Button content='Abbrechen' color='red' fluid onClick={(e) => {e.preventDefault();swal.close()}} />
                    </SemanticForm>
                )}
            />
        );
    }
}