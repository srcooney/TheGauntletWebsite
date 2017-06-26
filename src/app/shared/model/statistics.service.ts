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
  			console.log(events);
  			var usersList = [];
  			for (var i in events) {
  				usersList.push(this.eventsService.getUserKeysFromRsvpKeys(events[i].$key).map(
		        users =>
		        {
		          users = users.filter(function( obj ) { return obj.$key !== 'default';})
		          var eventRsvps = users.slice(0,events[i].maxNumUsers);
		          var eventWaitlists = users.slice(events[i].maxNumUsers);
		          totalRsvps += eventRsvps.length;
		          console.log(eventRsvps.length);
		          // console.log(totalRsvps);

		          aveRsvps = totalRsvps/events.length;
		          //console.log("BEFORE getting RSVPS")
		          //console.log(events.length);
		      		//console.log(aveRsvps);
		      		return eventRsvps.length;
		      		//return aveRsvps;
		        }));
		      }
		      aveRsvps = totalRsvps/events.length;
		      console.log("After getting RSVPS")
		      // console.log(usersList.flatMap(fbojs => Observable.combineLatest(fbojs) ));
		      console.log(totalRsvps)
		      console.log(events.length)
		      console.log(aveRsvps)
		    });

  			}

}
//.map(results => results.map(keyObj =>keyObj.$key));