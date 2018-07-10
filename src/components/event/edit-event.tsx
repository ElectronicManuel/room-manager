import * as React from 'react'
import { firestore, firebase } from '../../firebase';
import { Formik, FormikProps, FormikErrors } from 'formik';
import { Form as SemanticForm, Label, Divider, DropdownItemProps } from 'semantic-ui-react';
import { DayPickerRangeController, FocusedInputShape } from 'react-dates';
import * as Moment from 'moment';
import { extendMoment, DateRange } from 'moment-range';

const moment = extendMoment(Moment);

import swal from 'sweetalert2';
import autobind from 'autobind-decorator';

type EditEvent = RoomManager.EventInCreation;

type EditEventProps = {
    event: RoomManager.Event | RoomManager.EventInCreation,
    mode: 'create' | 'edit',
    deleteEvent: () => void,
    rooms: RoomManager.Room[],
    events: RoomManager.Event[],
    userDetails: RoomManager.User
    users: RoomManager.User[]
}

type EditEventState = {
    dateInputFocus: FocusedInputShape,
    usedDates: {
        [roomId: string]: Array<DateRange>
    }
}

export default class EditEventComp extends React.Component<EditEventProps, EditEventState> {

    startRef: HTMLElement | null
    endRef: HTMLElement | null

    constructor(props: EditEventProps) {
        super(props);

        this.state = {
            dateInputFocus: 'startDate',
            usedDates: {}
        }
    }

    componentDidMount() {
        if(this.startRef) {
            this.startRef.focus();
        }

        const usedDates: {
            [roomId: string]: Array<DateRange>
        } = {};
        this.props.events.map(event => {
            let eventId: string | null = null;
            if('_id' in this.props.event) {
                eventId = this.props.event._id;
            }
            if(eventId) {
                if(event._id == eventId) {
                    return;
                }
            }
            if(event.startDate && event.endDate) {
                const from = Moment.unix(event.startDate).subtract(12, 'hour');
                const to = Moment.unix(event.endDate);
                const range = moment.range(from, to);
                if(usedDates[event.roomId]) {
                    usedDates[event.roomId].push(range);
                } else {
                    usedDates[event.roomId] = [range];
                }
            } else {
                return;
            }
        });
        console.log(usedDates);
        this.setState({usedDates});
    }

    @autobind
    canEdit() {
        return this.props.userDetails.role != 'Hauswart';
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
    getUserName(userId: string) {
        console.log(userId);
        const foundUser = this.props.users.find((user) => user._id == userId);
        return foundUser != null ? foundUser.displayName : 'N/A';
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
        const initial = { ...this.props.event };
        if(this.props.mode == 'create') {
            initial.userId = (firebase.auth().currentUser as firebase.User).uid
        }

        return (
            <Formik
                initialValues={initial}
                isInitialValid={this.props.mode == 'edit'}
                onSubmit={async (values, actions) => {
                    actions.setSubmitting(true);
                    const { name, roomId, description, startDate, endDate } = values;
                    let  userId;
                    if(this.props.mode == 'create'){
                        userId = (firebase.auth().currentUser as firebase.User).uid;
                    }
                    else{
                        userId = values.userId;
                    }
                    
                    const editEvent = {
                        name,
                        roomId,
                        description,
                        startDate,
                        endDate,
                        userId
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
                    const { name, description, roomId, startDate, endDate } = values;
                    let errors: FormikErrors<EditEvent> = {};
                    if(name.length < 2) {
                        errors.name = 'Der Name muss mindestends 2 Zeichen lang sein'
                    }
                    if(!description) {
                        errors.description = 'Bitte füge eine Beschreibung hinzu!';
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

                    if(this.state.usedDates[values.roomId]) {
                        if(values.startDate && values.endDate) {
                            const range = moment.range(Moment.unix(values.startDate), Moment.unix(values.endDate));
                            for(const usedDate of this.state.usedDates[values.roomId]) {
                                if(usedDate.overlaps(range)) errors.startDate = 'Du darfst einen Raum nicht doppelt buchen!';
                            };
                        }
                    }

                    return errors;
                }}
                render={(formikBag: FormikProps<EditEvent>) => (
                    <SemanticForm onSubmit={formikBag.handleSubmit} loading={formikBag.isSubmitting}>
                        <SemanticForm.Input disabled={!this.canEdit()} label='Name' error={formikBag.errors.name != null} placeholder='Name des Events' name='name' value={formikBag.values.name} onChange={formikBag.handleChange} />
                        {formikBag.errors.name ? <Label pointing color='red'>{formikBag.errors.name}</Label> : null }
                        <SemanticForm.TextArea disabled={!this.canEdit()} label='Beschreibung' error={formikBag.errors.description != null} placeholder='Beschreibung des Events' name='description' value={formikBag.values.description} onChange={formikBag.handleChange} />
                        {formikBag.errors.description ? <Label pointing color='red'>{formikBag.errors.description}</Label> : null }
                        <SemanticForm.Dropdown disabled={!this.canEdit()} label='Raum' selection value={formikBag.values.roomId} onChange={ (e, {value}) => {formikBag.setFieldValue('roomId', value)}} placeholder="Raum" options={this.getRoomOptions()} error={formikBag.errors.roomId != null}></SemanticForm.Dropdown>
                        {formikBag.errors.roomId ? <Label pointing color='red'>{formikBag.errors.roomId}</Label> : null }
                        <SemanticForm.Group widths='2' unstackable>
                            <SemanticForm.Field  disabled={!this.canEdit()} error={formikBag.errors.startDate != null}>
                                <label>Start Datum</label>
                                <input className='date-picker-field' readOnly ref={ref => this.startRef = ref} onFocus={() => {this.setState({dateInputFocus: 'startDate'})}} placeholder='Start Datum' value={formikBag.values.startDate ? Moment.unix(formikBag.values.startDate).format('DD.MM.YYYY') : 'Nicht definiert'} />
                                {formikBag.errors.startDate ? <Label pointing color='red'>{formikBag.errors.startDate}</Label> : null }
                            </SemanticForm.Field>
                            <SemanticForm.Field  disabled={!this.canEdit()} error={formikBag.errors.endDate != null}>
                                <label>End Datum</label>
                                <input className='date-picker-field' readOnly ref={ref => this.endRef = ref} onFocus={() => {this.setState({dateInputFocus: 'endDate'})}} placeholder='End Datum' value={formikBag.values.endDate ? Moment.unix(formikBag.values.endDate).format('DD.MM.YYYY') : 'Nicht definiert'} />
                                {formikBag.errors.endDate ? <Label pointing color='red'>{formikBag.errors.endDate}</Label> : null }
                            </SemanticForm.Field>
                        </SemanticForm.Group>
                        

                        {
                            this.props.userDetails.role == 'Verwaltung' || this.props.userDetails.role == 'Hauswart' || formikBag.values.userId == (firebase.auth().currentUser as firebase.User).uid?
                            <SemanticForm.Input disabled={true} label='Host' error={formikBag.errors.userId != null} placeholder='Name des Users' name='host' value={this.getUserName(formikBag.values.userId)}/>
                            :
                                null
                        }
                 
                        {
                            this.canEdit() ?
                            <div>
                                <div>
                                    <DayPickerRangeController
                                        startDate={formikBag.values.startDate ? Moment.unix(formikBag.values.startDate) : null}
                                        endDate={formikBag.values.endDate ? Moment.unix(formikBag.values.endDate) : null}
                                        onDatesChange={({ startDate, endDate }) => {
                                            formikBag.setFieldValue('startDate', startDate ? startDate.unix() : undefined);
                                            formikBag.setFieldValue('endDate', endDate ? endDate.unix() : null);
                                        }}
                                        focusedInput={this.state.dateInputFocus}
                                        onFocusChange={this.handleFocusChange}
                                        isOutsideRange={(date) => {return false}}
                                        orientation='horizontal'
                                        hideKeyboardShortcutsPanel
                                        isDayBlocked={(day: Moment.Moment) => {
                                            if(!this.canEdit()) return true;
                                            
                                            let blocked = false;
                                            if(this.state.usedDates[formikBag.values.roomId]) {
                                                this.state.usedDates[formikBag.values.roomId].map(usedDate => {
                                                    if(usedDate.contains(day)) blocked = true;
                                                });
                                            }
                                            return blocked;
                                        } }
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