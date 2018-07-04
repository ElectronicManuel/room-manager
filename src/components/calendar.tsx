import * as React from 'react';
import BigCalendar from 'react-big-calendar';
import * as moment from 'moment';

moment.locale('de-CH');

(BigCalendar as any).setLocalizer(BigCalendar.momentLocalizer(moment));

class RoomCalendar extends React.Component<any, any> {
    render() {
        return (
            <div style={{height: '500px'}}>
                <BigCalendar
                    events={[
                        {
                            title: 'First thing',
                            start: '07.02.2018',
                            end: '07.08.2018',
                            color: 'blue'
                        },
                        {
                            title: 'Second thing',
                            start: '07.01.2018',
                            end: '07.07.2018',
                            color: 'red'
                        },
                        {
                            title: 'Second thing',
                            start: '07.01.2018',
                            end: '07.07.2018',
                            color: 'red'
                        },
                        {
                            title: 'Second thing',
                            start: '07.01.2018',
                            end: '07.07.2018',
                            color: 'red'
                        },
                        {
                            title: 'Second thing',
                            start: '07.01.2018',
                            end: '07.07.2018',
                            color: 'red'
                        },
                        {
                            title: 'Second thing',
                            start: '07.01.2018',
                            end: '07.07.2018',
                            color: 'red'
                        },
                        {
                            title: 'Second thing',
                            start: '07.01.2018',
                            end: '07.07.2018',
                            color: 'red'
                        }
                    ]}
                    startAccessor={(event: any) => {
                        return moment(event.start).toDate();
                    }}
                    endAccessor={(event: any) => {
                        return moment(event.end).toDate();
                    }}
                    titleAccessor={(event) => {
                        return event.title;
                    }}
                    allDayAccessor={(event) => {return true}}
                    eventPropGetter={(event: any) => {return {style: {backgroundColor: event.color}}}}
                    popup={true}
                    onSelectEvent={(event: any) => {
                        alert(event.title);
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

export default RoomCalendar;