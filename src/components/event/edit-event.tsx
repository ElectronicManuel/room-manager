import * as React from 'react'
import { firestore } from '../../firebase';
import { Formik, FormikProps, FormikErrors } from 'formik';
import { Form as SemanticForm, Label, Divider, DropdownItemProps } from 'semantic-ui-react';
import { DayPickerRangeController, FocusedInputShape } from 'react-dates';
import * as moment from 'moment';

import swal from 'sweetalert2';
import autobind from 'autobind-decorator';

type EditEvent = RoomManager.EventInCreation;

type EditEventProps = {
    event: RoomManager.Event | RoomManager.EventInCreation,
    mode: 'create' | 'edit',
    deleteEvent: () => void,
    rooms: RoomManager.Room[]
}

type EditEventState = {
    dateInputFocus: FocusedInputShape
}

export default class EditEventComp extends React.Component<EditEventProps, EditEventState> {

    startRef: HTMLElement | null
    endRef: HTMLElement | null

    constructor(props: EditEventProps) {
        super(props);

        this.state = {
            dateInputFocus: 'startDate'
        }
    }

    componentDidMount() {
        if(this.startRef) {
            this.startRef.focus();
        }
    }

    @autobind
    handleFocusChange(dateInputFocus: FocusedInputShape) {
        this.setState({dateInputFocus: dateInputFocus});
        if(dateInputFocus == 'startDate') {
            if(this.startRef) this.startRef.focus();
        } else if(dateInputFocus == 'endDate') {
            if(this.endRef) this.endRef.focus();
        }
    }

    @autobind
    getRoom(roomId: string) {
        return this.props.rooms.find((room) => room._id == roomId);
    }

    @autobind
    getRoomOptions() {
        const optionsArray: DropdownItemProps[] = [];
        for(const room of this.props.rooms) {
            optionsArray.push({
                text: <div style={{color: room.color}}>{room.name}</div>,
                value: room._id
            })
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
                    const { name, roomId, startDate, endDate } = values;

                    const editEvent = {
                        name,
                        roomId,
                        startDate,
                        endDate
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
                    const { name, roomId, startDate, endDate } = values;
                    let errors: FormikErrors<EditEvent> = {};
                    if(name.length < 2) {
                        errors.name = 'Der Name muss mindestends 2 Zeichen lang sein'
                    }
                    if(!roomId || roomId.length < 5) {
                        errors.roomId = 'Bitte wähle einen Raum';
                    }
                    if(!startDate) {
                        errors.startDate = 'Bitte wähle ein Start Datum'
                    }
                    if(!endDate) {
                        errors.endDate = 'Bitte wähle ein End Datum';
                    }
                    if(startDate && endDate) {
                        if(startDate >= endDate) {
                            errors.endDate = 'Das End Datum muss nach dem Start Datum liegen';
                        }
                    }

                    return errors;
                }}
                render={(formikBag: FormikProps<EditEvent>) => (
                    <SemanticForm onSubmit={formikBag.handleSubmit} loading={formikBag.isSubmitting}>
                        <SemanticForm.Input label='Name' error={formikBag.errors.name != null} placeholder='Name des Events' name='name' value={formikBag.values.name} onChange={formikBag.handleChange} />
                        {formikBag.errors.name ? <Label pointing color='red'>{formikBag.errors.name}</Label> : null }
                        <SemanticForm.Dropdown label='Raum' selection value={formikBag.values.roomId} onChange={ (e, {value}) => {formikBag.setFieldValue('roomId', value)}} placeholder="Raum" options={this.getRoomOptions()} error={formikBag.errors.roomId != null}></SemanticForm.Dropdown>
                        {formikBag.errors.roomId ? <Label pointing color='red'>{formikBag.errors.roomId}</Label> : null }
                        <SemanticForm.Group>
                            <SemanticForm.Field error={formikBag.errors.startDate != null}>
                                <label>Start Datum</label>
                                <input readOnly ref={ref => this.startRef = ref} onFocus={() => {this.setState({dateInputFocus: 'startDate'})}} placeholder='Start Datum' value={formikBag.values.startDate ? moment.unix(formikBag.values.startDate).format('DD.MM.YYYY') : 'Nicht definiert'} />
                                {formikBag.errors.startDate ? <Label pointing color='red'>{formikBag.errors.startDate}</Label> : null }
                            </SemanticForm.Field>
                            <SemanticForm.Field error={formikBag.errors.endDate != null}>
                                <label>End Datum</label>
                                <input readOnly ref={ref => this.endRef = ref} onFocus={() => {this.setState({dateInputFocus: 'endDate'})}} placeholder='End Datum' value={formikBag.values.endDate ? moment.unix(formikBag.values.endDate).format('DD.MM.YYYY') : 'Nicht definiert'} />
                                {formikBag.errors.endDate ? <Label pointing color='red'>{formikBag.errors.endDate}</Label> : null }
                            </SemanticForm.Field>
                        </SemanticForm.Group>
                        <div>
                            <DayPickerRangeController
                                startDate={formikBag.values.startDate ? moment.unix(formikBag.values.startDate) : null}
                                endDate={formikBag.values.endDate ? moment.unix(formikBag.values.endDate) : null}
                                onDatesChange={({ startDate, endDate }) => {
                                    formikBag.setFieldValue('startDate', startDate ? startDate.unix() : undefined);
                                    formikBag.setFieldValue('endDate', endDate ? endDate.unix() : null);
                                }}
                                focusedInput={this.state.dateInputFocus}
                                onFocusChange={this.handleFocusChange}
                                isOutsideRange={(date) => {return false}}
                                orientation='horizontal'
                                hideKeyboardShortcutsPanel
                            />
                        </div>
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