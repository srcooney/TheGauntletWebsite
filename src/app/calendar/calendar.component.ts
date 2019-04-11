// import { Component, OnInit } from '@angular/core';

// @Component({
//   selector: 'app-calendar',
//   templateUrl: './calendar.component.html',
//   styleUrls: ['./calendar.component.css']
// })
// export class CalendarComponent implements OnInit {

//   constructor() { }

//   ngOnInit() {
//   }

// }
import { Component,OnInit } from '@angular/core';
import {
  startOfDay,
  subDays,
  addDays,
  endOfMonth,
  isSameDay,
  isSameMonth,
  addWeeks,
  subWeeks,
  addMonths,
  subMonths,
  addHours
} from 'date-fns';
import { Subject } from 'rxjs/Subject';
import {
  CalendarEvent,
  CalendarEventAction,
  CalendarEventTimesChangedEvent
} from 'angular-calendar'; // import should be from `angular-calendar` in your app
import{EventsService} from '../shared/model/events.service';
const colors: any = {
  red: {
    primary: '#ad2121',
    secondary: '#FAE3E3'
  },
  blue: {
    primary: '#1e90ff',
    secondary: '#D1E8FF'
  },
  yellow: {
    primary: '#e3bc08',
    secondary: '#FDF1BA'
  }
};

@Component({
  selector: 'mwl-demo-app',
  styleUrls: ['./calendar.component.css'],
  templateUrl: './calendar.component.html',
})

export class CalendarComponent implements OnInit {

	gevents: any;
	events: CalendarEvent[];

  constructor(
  	private eventsService: EventsService,) { }

  eventClicked(calendarEvent){

    const clickedEvent = this.gevents.filter(event => event.title == calendarEvent.title);
    this.eventsService.routeToEventDetail(clickedEvent[0].$key);
  }
  ngOnInit() {
    this.changeEventsForMonth();
  }

  changeEventsForMonth(){
    var firstDayOfMonth = new Date(this.viewDate.getFullYear(), this.viewDate.getMonth(), 1);
    var lastDayOfMonth = new Date(this.viewDate.getFullYear(), this.viewDate.getMonth() + 1, 0);


  	this.eventsService.findEventsBetweenDates(firstDayOfMonth,lastDayOfMonth)
  		.subscribe(events => 
  		{
        var moment = require('moment');
        events.forEach(event => 
          {
            event.title = event.title + ' ' +  moment(event.eventStartTime).format('h:mm a').toString();
          })
  			this.gevents = events;
  			this.events = events.map(event => 
  			{
  				return this.returnCalendarEvent(
						{
					    start: event.eventStartTime,
					    title:event.title,
					    color: colors.red,
					    // actions: this.actions
					  }
  					);
  			});
  		});
  }

  returnCalendarEvent(object : any) : CalendarEvent {
  		return object;
  }
  view: string = 'month';

  viewDate: Date = new Date();

  actions: CalendarEventAction[] = [{
    label: '<i class="fa fa-fw fa-pencil"></i>',
    onClick: ({event}: {event: CalendarEvent}): void => {
    }
  }, {
    label: '<i class="fa fa-fw fa-times"></i>',
    onClick: ({event}: {event: CalendarEvent}): void => {
    	if(this.events != undefined)
      	this.events = this.events.filter(iEvent => iEvent !== event);
    }
  }];

  refresh: Subject<any> = new Subject();

  activeDayIsOpen: boolean = false;

  increment(): void {

    const addFn: any = {
      day: addDays,
      week: addWeeks,
      month: addMonths
    }[this.view];

    this.viewDate = addFn(this.viewDate, 1);
    this.changeEventsForMonth();

  }

  decrement(): void {

    const subFn: any = {
      day: subDays,
      week: subWeeks,
      month: subMonths
    }[this.view];

    this.viewDate = subFn(this.viewDate, 1);
    this.changeEventsForMonth();

  }

  today(): void {
    this.viewDate = new Date();
  }

  dayClicked({date, events}: {date: Date, events: CalendarEvent[]}): void {

    if (isSameMonth(date, this.viewDate)) {
      if (
        (isSameDay(this.viewDate, date) && this.activeDayIsOpen === true) ||
        events.length === 0
      ) {
        this.activeDayIsOpen = false;
      } else {
        this.activeDayIsOpen = true;
        this.viewDate = date;
      }
    }
  }

  eventTimesChanged({event, newStart, newEnd}: CalendarEventTimesChangedEvent): void {
    event.start = newStart;
    event.end = newEnd;
    this.refresh.next();
  }

}