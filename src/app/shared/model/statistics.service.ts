import { Injectable } from '@angular/core';
import {EventsService} from './events.service';
@Injectable()
export class StatisticsService {

  constructor(
  	private eventsService:EventsService,) { }

  getEventAveRsvps(){
  	var totalRsvps = 0;
  	var aveRsvps = 0;
  	this.eventsService.findAllEvents().subscribe(
  		events => {
  			var usersList = [];
  			for (var i in events) {
  				usersList.push(this.eventsService.getUserKeysFromRsvpKeys(events[i].$key).map(
		        users =>
		        {
		          users = users.filter(function( obj ) { return obj.$key !== 'default';})
		          var eventRsvps = users.slice(0,events[i].maxNumUsers);
		          var eventWaitlists = users.slice(events[i].maxNumUsers);
		          totalRsvps += eventRsvps.length;
		          aveRsvps = totalRsvps/events.length;
		      		return eventRsvps.length;
		        }));
		      }
		      aveRsvps = totalRsvps/events.length;
		    });

  			}

}
//.map(results => results.map(keyObj =>keyObj.$key));