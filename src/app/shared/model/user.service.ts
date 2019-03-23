import { Injectable,Inject } from '@angular/core';
import {AngularFire,FirebaseRef} from 'angularfire2';
import {Observable,Subject} from 'rxjs/Rx';
import{GauntletEvent} from './gauntletEvent';
import {User} from "./user";

@Injectable()
export class UserService {
sdkDb:any;
  constructor(
  	private af: AngularFire,
    @Inject(FirebaseRef) fb,) { 
this.sdkDb = fb.database().ref();
  }


  isRsvpedToEvent(eventKey:string,userKey:string):Observable<any>{
    const event = this.af.database.object('rsvpPerUser/'+userKey+'/'+eventKey)
    .map(eventObj => eventObj.$value);
    return event.map(value => value != null);
  }

  isWaitlistedToEvent(eventKey:string,userKey:string):Observable<any>{
    const event = this.af.database.object('waitlistPerUser/'+userKey+'/'+eventKey)
    .map(eventObj => eventObj.$value);
    return event.map(value => value != null);
  }


  isuidtrue(event) {
    // return this.af.database.list('rsvpPerEvent/'+event.$key+'/'+uid)
    //         .map(eventObj => eventObj.$value)
    //         .map(value => value != null);
  }
  // getRsvpListFromUid(uid:string): Observable<GauntletEvent[]>{
  //   const alleventKeys = this.af.database.list('rsvpPerEvent')
  //       .filter((event,index) =>
  //       {
  //             return event[index][uid] != undefined;
  //       })
  //       ;
  //   const events = alleventKeys
  //       .map(results => results
  //       .map(eventKey => 
  //         this.af.database.object("events/" + eventKey.$key)  
  //         ) )
  //       .flatMap(fbojs => Observable.combineLatest(fbojs) )
  //       return events;
  // }

  firebaseUpdate(dataToSave) {
      const subject = new Subject();

      this.sdkDb.update(dataToSave)
          .then(
              val => {
                  subject.next(val);
                  subject.complete();

              },
              err => {
                  subject.error(err);
                  subject.complete();
              }
          );

      return subject.asObservable();
  }

  updateAttributeStatus(userKey:string,attribute:string,status:any){
    let dataToSave = {};

    dataToSave["users/" + userKey +"/"+attribute] = status;
    return this.firebaseUpdate(dataToSave);
  }

  findAllUsersByAttribute(attribute:string,status:boolean):Observable<User[]>{
    return this.af.database.list('users', {
      query:{
        orderByChild:attribute,
        equalTo: status
      }
    });
  }

  findUserbyUid(uid:string) :Observable<User>{
     return this.af.database.list('users', {
      query:{
        orderByChild:'uid',
        equalTo: uid
      }
    }).map(results => results[0]);
  }

    findUserbyUidObs(uid:Observable<string>) :Observable<User>{
     return this.af.database.list('users', {
      query:{
        orderByChild:'uid',
        equalTo: uid
      }
    }).map(results =>
    {
       if(results.length == 1){
         return results[0];
       } else{
         return null;
       }
        
    }
     );
  }

  getWaitListsFromUserKey(userKey:string): Observable<GauntletEvent[]>{
    const eventKeys = this.getEventKeysFromUserKey("waitlistPerUser/",userKey);
    return this.findEventsFromEventKeys(eventKeys);
  }

  getCreatorListFromUserKey(userKey:string): Observable<GauntletEvent[]>{
    const eventKeys = this.getEventKeysFromUserKey("eventsCreatedPerUser/",userKey);
    return this.findEventsFromEventKeys(eventKeys);
  }

  getRsvpListFromUserKey(userKey:string): Observable<GauntletEvent[]>{
  	const eventKeys = this.getEventKeysFromUserKey("rsvpPerUser/",userKey);
	  return this.findEventsFromEventKeys(eventKeys);
  }

  getEventKeysFromUserKey(node:string, userKey:string):Observable<string[]>{
    return this.af.database.list(node+userKey)
      .map(results => results.map(keyObj =>keyObj.$key));
  }
  
  findEventsFromEventKeys(eventKeys$: Observable<string[]>) :Observable<GauntletEvent[]> {
      return eventKeys$
          .map(eventsKeys => eventsKeys.map(eventKey => this.af.database.object('events/' + eventKey)) )
          .flatMap(fbojs => Observable.combineLatest(fbojs) )

  }

}
