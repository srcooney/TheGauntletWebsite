import { Injectable } from '@angular/core';
import {AngularFire} from 'angularfire2';
import {Observable} from 'rxjs/Rx';
import{GauntletEvent} from './gauntletEvent';
@Injectable()
export class UserService {

  constructor(
  	private af: AngularFire,) { }

  getRsvpListFromUid(uid:string): Observable<GauntletEvent[]>{

  	// read rsvpPerUser node and get list of eventkeys
  	const eventKeys = this.af.database.list("rsvpPerUser/"+uid)
  	.map(results => results.map(keyObj =>keyObj.$key));

    // get list of events from event keys
  	// const events = eventKeys
  	// 	.map(eventKeys => 
  	// 		eventKeys.map(eventKey => this.af.database.object("events/" + eventKey)))
  	// 	.flatMap(fbojs => Observable.combineLatest(fbojs) )
	 return this.findLessonsForLessonKeys(eventKeys);
  	// .do(console.log)
  	// .subscribe();
  	
  	// const events = 
  	// return list of events
  	// return events;
  	// return new Observable<GauntletEvent[]>();

  }

  // findLessonKeysForUid(uid:string) : Observable<any> {
  // 	return 
  // }

  findLessonsForLessonKeys(lessonKeys$: Observable<string[]>) :Observable<GauntletEvent[]> {
      return lessonKeys$
          .map(lspc => lspc.map(lessonKey => this.af.database.object('events/' + lessonKey)) )
          .flatMap(fbojs => Observable.combineLatest(fbojs) )

  }

}
