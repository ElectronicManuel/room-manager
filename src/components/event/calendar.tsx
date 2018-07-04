import * as React from 'react';
import BigCalendar from 'react-big-calendar';
import * as moment from 'moment';
import autobind from 'autobind-decorator';

moment.locale('de-CH');

(BigCalendar as any).setLocalizer(BigCalendar.momentLocalizer(moment));

type CalendarProps = {
    events: RoomManager.Event[],
    rooms: RoomManager.Room[],
    editEvent: (event: RoomManager.Event) => void,
    deleteEvent: (event: RoomManager.Event) => void
}

class EventCalendar extends React.Component<CalendarProps, any> {

    @autobind
    getRoom(roomId: string) {
        const defaultRoom: RoomManager.RoomInCreation = {
            name: 'Kein Raum',
            color: 'black'
        }
        const foundRoom = this.props.rooms.find((room) => room._id == roomId);
        if(foundRoom) {
            return foundRoom;
        } else {
            return defaultRoom;
        }
    }

    render() {
        return (
            <div style={{height: '500px'}}>
                <BigCalendar
                    events={this.props.events}
                    startAccessor={(event: RoomManager.Event) => {
                        return moment().subtract(1, 'days').toDate();
                    }}
                    endAccessor={(event: RoomManager.Event) => {
                        return moment().add(1, 'days').toDate();
                    }}
                    titleAccessor={(event: RoomManager.Event) => {
                        return `'${event.name}' @ ${this.getRoom(event.roomId).name}`;
                    }}
                    allDayAccessor={(event: RoomManager.Event) => {return true}}
                    eventPropGetter={(event: RoomManager.Event) => {return {style: {backgroundColor: this.getRoom(event.roomId).color}}}}
                    popup={true}
                    onSelectEvent={(event: RoomManager.Event) => {
                        this.props.editEvent(event);
                    }}
                    views={['month', 'week']}
                    messages={{
                        allDay: 'Ganzer Tag',
                        previous: '<',
                        next: '>',
                        today: 'Heute',
                        month: 'Monat',
                        week: 'Woche',
                        day: 'Tag',
                        agenda: 'Agenda',
                        date: 'Datum',
                        time: 'Zeit',
                        event: 'Event',
                        showMore: (input) => `Zeige ${JSON.stringify(input)} mehr`
                      }}
                />
            </div>
        )
    }
}

export default EventCalendar;