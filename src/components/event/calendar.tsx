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
                        return event.startDate ? moment.unix(event.startDate).toDate() : moment().toDate();
                    }}
                    endAccessor={(event: RoomManager.Event) => {
                        return event.endDate ? moment.unix(event.endDate).toDate() : moment().toDate();
                    }}
                    titleAccessor={(event: RoomManager.Event) => {
                        return `'${event.name}' @ ${this.getRoom(event.roomId).name}`;
                    }}
                    allDayAccessor={(event: RoomManager.Event) => {return true}}
                    eventPropGetter={(event: RoomManager.Event) => {
                        const eventProps = {
                            style: {
                                backgroundColor: this.getRoom(event.roomId).color,
                                color: isTooDark(this.getRoom(event.roomId).color) ? 'white' : 'black'
                            },
                            className: 'event-display'
                        }

                        return eventProps;
                    }}
                    popup={true}
                    onSelectEvent={(event: RoomManager.Event) => {
                        this.props.editEvent(event);
                    }}
                    views={['month', 'week', 'agenda']}
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

function isTooDark(hexcolor: string) {
    const color = hexcolor.substring(1);
    var r = parseInt(color.substr(1,2),16);
    var g = parseInt(color.substr(3,2),16);
    var b = parseInt(color.substr(4,2),16);
    var yiq = ((r*299)+(g*587)+(b*114))/1000;
    return (yiq < 100);
}

export default EventCalendar;