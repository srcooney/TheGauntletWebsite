import { Component, OnInit } from '@angular/core';
import{EventsService} from '../shared/model/events.service';
import{GauntletEvent} from '../shared/model/gauntletEvent';
import {Observable,Subject} from "rxjs/Rx";

@Component({
  selector: 'app-all-events-info',
  templateUrl: './all-events-info.component.html',
  styleUrls: ['./all-events-info.component.css']
})
export class AllEventsInfoComponent implements OnInit {

  allEvents:GauntletEvent[];
  filteredEvents:GauntletEvent[];

	rows;

   columns = 
   [
    { name: 'Title', prop: 'title' },
    { name: 'Event Creator', prop: 'eventCreator' },
    { name: 'Start Time', prop: 'eventStartTime' },
    { name: 'All Access Time', prop: 'allAccessTime' },
    { name: 'Percent RSVP\'d', prop: 'percentRsvped' },
    { name: 'Max Number of Users', prop: 'maxNumUsers' },
    { name: 'rsvps', prop: 'rsvps' },
    { name: 'WaitList', prop: 'waitlist' }
  ];

  switchTable = true;
  btn_txt = "Excel Table";
  constructor(private eventsService: EventsService,) { }

  ngOnInit() {

  	 this.eventsService.findAllEvents()
     .subscribe(
        events => 
        {
          this.allEvents = this.filteredEvents = events;
          this.filteredEvents = this.eventsService.getAllFutureEvents(this.allEvents);


				for (var i = 0; i < this.filteredEvents.length; i++) { 
          var moment = require('moment');

          this.filteredEvents[i].allAccessTime = moment(this.filteredEvents[i].allAccessTime).format('dddd , MMMM D, YYYY, HH:mm a').toString();
          this.filteredEvents[i].eventStartTime = moment(this.filteredEvents[i].eventStartTime).format('dddd , MMMM D, YYYY, HH:mm a').toString();
					(function(that,i) {
						that.eventsService.getRsvpsKeysFromEventKey(that.filteredEvents[i].$key).subscribe(
		          userRsvps =>
		         {
		           userRsvps = userRsvps.filter(function( obj ) { return obj.$key !== 'default';})
               var waitlist = userRsvps.length > that.filteredEvents[i].maxNumUsers ? userRsvps.length - that.filteredEvents[i].maxNumUsers : 0;
               var rsvps = userRsvps.length > that.filteredEvents[i].maxNumUsers ? that.filteredEvents[i].maxNumUsers : userRsvps.length;
               var percentRsvped = Math.round((rsvps / that.filteredEvents[i].maxNumUsers) *100);
		           that.filteredEvents[i] = Object.assign({},that.filteredEvents[i],{rsvps:rsvps,waitlist:waitlist,percentRsvped:percentRsvped});
               if(i == that.filteredEvents.length-1)
               {
                 that.rows = that.filteredEvents;
               }
		         });
					    })(this,i);



				    
				};

        }
      );
  }

toggleTable()
{
  this.switchTable = !this.switchTable;
  if(this.switchTable == false)
    {
      this.btn_txt = "Pretty Table";
    }
  else {
    this.btn_txt = "Excel Table";
  }
}

  routeToEventDetail(eventKey:string){
    this.eventsService.routeToEventDetail(eventKey);
  }

  onActivate(event) {
    console.log('Activate Event', event);
    this.eventsService.routeToEventDetail(event.row.$key);
  }

}

