import { Injectable,Inject } from '@angular/core';
import {AngularFireDatabase,AngularFire,FirebaseListObservable,FirebaseRef} from "angularfire2";
import {GauntletEvent} from "./gauntletEvent";
import {User} from "./user";
import {Observable,Subject} from "rxjs/Rx";
import {Router} from "@angular/router";
// import {MomentModule} from 'angular2-moment/module';
@Injectable()
export class EventsService {

	sdkDb:any;

  constructor(
    private router:Router,
  	private db:AngularFireDatabase,
  	private af: AngularFire,
  	@Inject(FirebaseRef) fb,) {
			this.sdkDb = fb.database().ref();
  	}

	// findAllEvents():Observable<GauntletEvent[]> {
 //        return this.db.list('events').map(GauntletEvent.fromJsonList);
 //  } 

  findAllEvents():Observable<GauntletEvent[]> {
    return this.af.database.list('events', {
      query:{
        orderByChild:"eventStartTime",
      }
    }).map(GauntletEvent.fromJsonList);

        // return this.db.list('events').map(GauntletEvent.fromJsonList);
  } 

  

  getEventById(id:string){
    return this.db.object('events/'+id).map(GauntletEvent.fromJson);
  }

  createNewEvent( event:any): Observable<any> {

      const eventToSave = Object.assign({},event,{currNumUsers:0});

      var moment = require('moment');

      //convert from UTC to central time zone
      eventToSave.allAccessTime = moment(eventToSave.allAccessTime).format().toString();
      eventToSave.eventStartTime = moment(eventToSave.eventStartTime).format().toString();

      const newEventKey = this.sdkDb.child('events').push().key;

      let dataToSave = {};

      dataToSave["events/" + newEventKey] = eventToSave;

      return this.firebaseUpdate(dataToSave);
  }

  updateEvent(event,eventUpdate): Observable<any> {

      const eventToSave = Object.assign({},eventUpdate,{currNumUsers:event.currNumUsers});
      var moment = require('moment');
      moment().format();
      //convert from UTC to central time zone
      eventToSave.allAccessTime = moment(eventToSave.allAccessTime).toString();
      eventToSave.eventStartTime = moment(eventToSave.eventStartTime).toString();

      let dataToSave = {};

      dataToSave["events/" + event.$key] = eventToSave;

      return this.firebaseUpdate(dataToSave);

  }

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

  firebaseRemove(dataToSave) {
      const subject = new Subject();

      this.sdkDb.delete(dataToSave)
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

  saveRsvpWaitlist(eventKey: string,userKey:string,currNumUsers:number) {
    let dataToSave = {};
    dataToSave[`waitlistPerEvent/${eventKey}/${userKey}`] = true;
    dataToSave[`waitlistPerUser/${userKey}/${eventKey}`] = true;
    return this.firebaseUpdate(dataToSave);
  }

  cancelRsvpWaitlist(eventKey: string,userKey:string,currNumUsers:number) {
    this.db.list('waitlistPerUser/'+userKey+"/"+eventKey).remove();
    this.db.list("waitlistPerEvent/"+eventKey).remove();
  }

  saveRsvp(eventKey: string,userKey:string,currNumUsers:number) {
    let dataToSave = {};
    currNumUsers += 1;
    dataToSave['events/'+eventKey+'/currNumUsers'] = currNumUsers;
    dataToSave[`rsvpPerEvent/${eventKey}/${userKey}`] = true;
    dataToSave[`rsvpPerUser/${userKey}/${eventKey}`] = true;
    return this.firebaseUpdate(dataToSave);
  }

  cancelRsvp(eventKey: string,userKey:string,currNumUsers:number) {
    

    // Check if anyone is on the waitlist and fill up the space if there is
    this.db.list("waitlistPerEvent/"+eventKey).first().subscribe( waitlist =>
    {
      this.db.list('rsvpPerUser/'+userKey+"/"+eventKey).remove();
      this.db.list("rsvpPerEvent/"+eventKey).remove();
      let dataToSave = {};
      currNumUsers -= 1;
      dataToSave['events/'+eventKey+'/currNumUsers'] = currNumUsers;
      this.firebaseUpdate(dataToSave);
      console.log(waitlist,waitlist.length,eventKey);
      if(waitlist.length != 0){
        this.cancelRsvpWaitlist(eventKey,waitlist[0].$key,currNumUsers);
        this.saveRsvp(eventKey,waitlist[0].$key,currNumUsers);
        
      }
    });

  }

  removeEvent(eventKey:string) {
    // Delete event from all users
    this.db.list('rsvpPerUser')
    .map(results => 
      results.map(keyObj =>
        this.db.list('rsvpPerUser/'+keyObj.$key+"/"+eventKey).remove()))
    .subscribe();
    
    this.db.list('waitlistPerUser')
    .map(results => 
      results.map(keyObj =>
        this.db.list('waitlistPerUser/'+keyObj.$key+"/"+eventKey).remove()))
    .subscribe();
    // Delete event from comments list
    this.db.list("commentPerEvent/"+eventKey).remove();
    // Delete event from rsvp list
    this.db.list("waitlistPerEvent/"+eventKey).remove();
    this.af.database.list("rsvpPerEvent/"+eventKey).remove();
    // Delete event from events
    this.af.database.list("events/"+eventKey).remove();
  }

  moveWaitlistToRsvp(eventKey:string,userKey:string,currNumUsers:number){
    
    //remove from waitlist
    this.cancelRsvpWaitlist(eventKey,userKey,currNumUsers);
    //add to rsvp
    this.saveRsvp(eventKey,userKey,currNumUsers);
  }

  routeToEventDetail(eventKey:string){
    this.router.navigate(['event-detail',eventKey]);
  }

  isRoom(event:GauntletEvent) {
    return event.currNumUsers < event.maxNumUsers;
  }

  getWaitListsFromEventKey(eventKey:string): Observable<User[]>{
    const eventKeys = this.getUserKeysFromEventKey("waitlistPerEvent/",eventKey);
    return this.findUsersFromUserKeys(eventKeys);
  }

  getRsvpsFromEventKey(eventKey:string): Observable<User[]>{
    const eventKeys = this.getUserKeysFromEventKey("rsvpPerEvent/",eventKey);
    return this.findUsersFromUserKeys(eventKeys);
  }

  getUserKeysFromEventKey(node:string, eventKey:string):Observable<string[]>{
    return this.af.database.list(node+eventKey)
      .map(results => results.map(keyObj =>keyObj.$key));
  }
  
  findUsersFromUserKeys(userKeys$: Observable<string[]>) :Observable<User[]> {
      return userKeys$
          .map(userKeys => userKeys.map(userKey => this.af.database.object('users/' + userKey)) )
          .flatMap(fbojs => Observable.combineLatest(fbojs) )
  }

  findCommentsFromCommentKeys(commentKeys$: Observable<string[]>,eventKey:string) :Observable<any[]> {
      return commentKeys$
          .map(userKeys => userKeys.map(commentKey => this.af.database.object("commentPerEvent/"+eventKey+"/"+commentKey)) )
          .flatMap(fbojs => Observable.combineLatest(fbojs) )
  }

  saveComment(comment:string,eventKey:string,displayName:string){
    let dataToSave = {};

    const newLessonKey = this.sdkDb.child('commentPerEvent/'+eventKey).push().key;

    dataToSave['commentPerEvent/'+eventKey+"/"+newLessonKey+'/comment'] = comment;
    dataToSave['commentPerEvent/'+eventKey+"/"+newLessonKey+'/displayName'] = displayName;
    return this.firebaseUpdate(dataToSave);
  }

  getCommentFromEventKey(eventKey:string){
    const commentKeys = this.getUserKeysFromEventKey("commentPerEvent/",eventKey)
    return this.findCommentsFromCommentKeys(commentKeys,eventKey);
  }
}
