import { Injectable,Inject } from '@angular/core';
import {AngularFireDatabase,AngularFire,FirebaseListObservable,FirebaseRef} from "angularfire2";
import {GauntletEvent} from "./gauntletEvent";
import {User} from "./user";
import {Observable,Subject} from "rxjs/Rx";
import {Router} from "@angular/router";
import {EmailService} from './email.service';
import {AuthInfo} from "../security/auth-info";
// import {MomentModule} from 'angular2-moment/module';
@Injectable()
export class EventsService {

	sdkDb:any;
  sdkStr:any;
  constructor(
    private router:Router,
  	private db:AngularFireDatabase,
  	private af: AngularFire,
    private emailService: EmailService,
  	@Inject(FirebaseRef) fb,) {
			this.sdkDb = fb.database().ref();
      this.sdkStr = fb.storage().ref();
  	}

	// findAllEvents():Observable<GauntletEvent[]> {
 //        return this.db.list('events').map(GauntletEvent.fromJsonList);
 //  } 

  uploadFile(eventKey,file){
    // var storage = this.fb.storage().ref();
    var imageStorage = this.sdkStr.child(eventKey);
    // var file = ... // use the Blob or File API
    imageStorage.put(file).then(function(snapshot) {
      console.log('Uploaded a blob or file!');
      
    });
  }

  getDownloadURL(eventKey){
    const subject = new Subject();
    var imageStorage = this.sdkStr;
    imageStorage.child(eventKey).getDownloadURL().then(function(url) {
      console.log(url);
        subject.next(url);
        subject.complete();
      }).catch(function(error) {
        // Handle any errors
      });
    return subject.asObservable();
  }

  findAllEvents():Observable<GauntletEvent[]> {
    return this.af.database.list('events', {
      query:{
        orderByChild:"eventStartTime",
      }
    }).map(GauntletEvent.fromJsonList);

        // return this.db.list('events').map(GauntletEvent.fromJsonList);
  } 

  getAllFutureEvents(events){
    var moment = require('moment');
    return events.filter(event => 
      {
        var isold = moment(event.eventStartTime).fromNow();
        // this deletes events that are more that 6 months old
        // console.log(isold);
        // if(isold.includes("6 months ago")) {
        //   this.removeEvent(event.$key);
        // }
        return !isold.includes("ago");
      });
  }

  getAllPastEvents(events){
    var moment = require('moment');
    return events.filter(event => 
      {
        var isold = moment(event.eventStartTime).fromNow();
        return isold.includes("ago");
      });
  }
  

  getEventById(id:string){
    return this.db.object('events/'+id).map(GauntletEvent.fromJson);
  }

  // createNewEvent( event:any,file): Observable<any> {

  //     const eventToSave = Object.assign({},event,{currNumUsers:0});

  //     console.log(file);
  //     console.log(event);
  //     console.log(eventToSave);
  //     var moment = require('moment');

  //     //convert from UTC to central time zone
  //     eventToSave.allAccessTime = moment(eventToSave.allAccessTime).format().toString();
  //     eventToSave.eventStartTime = moment(eventToSave.eventStartTime).format().toString();

  //     const newEventKey = this.sdkDb.child('events').push().key;
  //     if(file != undefined){
  //       this.uploadFile(newEventKey,file);
  //     }
      
  //     let dataToSave = {};

  //     dataToSave["events/" + newEventKey] = eventToSave;
  //     dataToSave["rsvpPerEvent/" + newEventKey] = {default:true};
  //     return this.firebaseUpdate(dataToSave);
  // }

  createNewEvent( event:any,file,eventCreator:AuthInfo): Observable<any> {
    const eventToSave = Object.assign({},event,{currNumUsers:0,eventCreator:eventCreator.displayName,eventCreatorKey: eventCreator.key});
    var moment = require('moment');

    //convert from UTC to central time zone
    eventToSave.allAccessTime = moment(eventToSave.allAccessTime).format().toString();
    eventToSave.eventStartTime = moment(eventToSave.eventStartTime).format().toString();

    const newEventKey = this.sdkDb.child('events').push().key;

    if(file != undefined){
      const subject = new Subject();
      var imageStorage = this.sdkStr.child(newEventKey);
      var that = this;
      var uploadTask = imageStorage.put(file).then(function(snapshot) {
        subject.next(snapshot);
        subject.complete();
        let dataToSave = {};
        eventToSave.imageURL = snapshot.downloadURL;
        dataToSave["events/" + newEventKey] = eventToSave;
        dataToSave["rsvpPerEvent/" + newEventKey] = {default:true};
        dataToSave["eventsCreatedPerUser/" + eventCreator.key +"/"+newEventKey] = true;
        return that.firebaseUpdate(dataToSave);
      });
     return subject.asObservable();

    } else{
      let dataToSave = {};
      eventToSave.imageURL = "";
      dataToSave["events/" + newEventKey] = eventToSave;
      dataToSave["rsvpPerEvent/" + newEventKey] = {default:true};
      dataToSave["eventsCreatedPerUser/" + eventCreator.key +"/"+newEventKey] = true;
      return this.firebaseUpdate(dataToSave);
    }
  }

  updateEvent(event,eventUpdate,file): Observable<any> {
      console.log(event)
      console.log(eventUpdate)
      const eventToSave = Object.assign({},eventUpdate,{currNumUsers:event.currNumUsers,imageURL:event.imageURL,eventCreator:event.eventCreator});
      var moment = require('moment');
      moment().format();
      //convert from UTC to central time zone
      // eventToSave.allAccessTime = moment(eventToSave.allAccessTime).toString();
      // eventToSave.eventStartTime = moment(eventToSave.eventStartTime).toString();
      eventToSave.allAccessTime = moment(eventToSave.allAccessTime).format().toString();
      eventToSave.eventStartTime = moment(eventToSave.eventStartTime).format().toString();
console.log(file);
/////////////////////////////////////////////
if(file != undefined){
      const subject = new Subject();
      var imageStorage = this.sdkStr.child(event.$key);
      var that = this;
      var uploadTask = imageStorage.put(file).then(function(snapshot) {
        subject.next(snapshot);
        subject.complete();
        let dataToSave = {};
        eventToSave.imageURL = snapshot.downloadURL;
        dataToSave["events/" + event.$key] = eventToSave;
        return that.firebaseUpdate(dataToSave);
      });
     return subject.asObservable();

    } else{
      let dataToSave = {};
      // eventToSave.imageURL = "";
      dataToSave["events/" + event.$key] = eventToSave;
      return this.firebaseUpdate(dataToSave);
    }
/////////////////////////////////////////////

      // let dataToSave = {};

      // dataToSave["events/" + event.$key] = eventToSave;

      // return this.firebaseUpdate(dataToSave);

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
    console.log("saveRsvp " +eventKey+"userKey "+userKey);

    // dataToSave['events/'+eventKey+'/currNumUsers'] = currNumUsers;
    var moment = require('moment');
    var now = moment().toISOString();
    console.log(now);
    dataToSave[`rsvpPerEvent/${eventKey}/${userKey}`] = {time:now,hasEmailed:false};
    dataToSave[`rsvpPerUser/${userKey}/${eventKey}`] = {time:now,hasEmailed:false};
    return this.firebaseUpdate(dataToSave);
  }

  sendEmailandUpdateEmailStat(rsvp,eventKey,eventCreatorKey){
    let dataToSave = {};
    console.log(`rsvpPerEvent/${eventKey}/${rsvp.$key}`)
    dataToSave[`rsvpPerEvent/${eventKey}/${rsvp.$key}`] = {time:rsvp.time,hasEmailed:true};

    this.firebaseUpdate(dataToSave);

    // console.log(`rsvpPerEvent/${eventKey}/${userKey}/hasEmailed`)
    //   this.sdkDb.object(`rsvpPerEvent/${eventKey}/${userKey}/hasEmailed`).update(true);
    this.emailService.sendRSVPUpdateEmailFromKey(rsvp.$key,eventKey,eventCreatorKey);
  }

  cancelRsvp(eventKey: string,userKey:string,currNumUsers:number) {
    console.log("cancelRsvp " +eventKey);
      this.db.list('rsvpPerUser/'+userKey+"/"+eventKey).remove();
      this.db.list("rsvpPerEvent/"+eventKey+"/"+userKey).remove();

    // Check if anyone is on the waitlist and fill up the space if there is
    // this.db.list("waitlistPerEvent/"+eventKey).first().subscribe( waitlist =>
    // {
    //   this.db.list('rsvpPerUser/'+userKey+"/"+eventKey).remove();
    //   this.db.list("rsvpPerEvent/"+eventKey+"/"+userKey).remove();
    //   let dataToSave = {};
    //   currNumUsers -= 1;
    //   console.log("cancelRsvp " +eventKey);
    //   dataToSave['events/'+eventKey+'/currNumUsers'] = currNumUsers;
    //   this.firebaseUpdate(dataToSave);
    //   console.log(waitlist,waitlist.length,eventKey);
    //   if(waitlist.length != 0){
    //     this.cancelRsvpWaitlist(eventKey,waitlist[0].$key,currNumUsers);
    //     this.saveRsvp(eventKey,waitlist[0].$key,currNumUsers);
        
    //   }
    // });

  }

  removeEvent(eventKey:string) {
    // Delete event from all users
    this.db.list('rsvpPerUser')
    .map(results => 
      results.map(keyObj =>
        this.db.list('rsvpPerUser/'+keyObj.$key+"/"+eventKey).remove()))
    .subscribe();

    // Delete event from all users
    this.db.list('eventsCreatedPerUser')
    .map(results => 
      results.map(keyObj =>
        this.db.list('eventsCreatedPerUser/'+keyObj.$key+"/"+eventKey).remove()))
    .subscribe();
    
    this.db.list('waitlistPerUser')
    .map(results => 
      results.map(keyObj =>
        this.db.list('waitlistPerUser/'+keyObj.$key+"/"+eventKey).remove()))
    .subscribe();

    var imageStorage = this.sdkStr.child(eventKey).delete()
    .then(function() {
      console.log("File deleted successfully");
    }).catch(function(error) {
      console.log("Uh-oh, an error occurred!");
    });;

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

  routeToEvents(){
    this.router.navigate(['events']);
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

//NEW FUNCTION
  getUserKeysFromRsvpKeys(eventKey){
    const rsvps = this.getRsvpsKeysFromEventKey(eventKey);
    const rsvpKeys = rsvps.map(results => results.map(keyObj =>keyObj.$key));
    return this.findUsersFromUserKeys(rsvpKeys);
  }

  getRsvpsKeysFromEventKey(eventKey:string){
    const rsvpKeys = this.af.database.list("rsvpPerEvent/"+eventKey);
    //console.log("getRsvpsKeysFromEventKey");
    //console.log()
    const rsvpSorted = this.sortRsvpKeysByDatetime(rsvpKeys);
    return rsvpSorted;
  }

  sortRsvpKeysByDatetime(rsvpKeys){
   return rsvpKeys.map( rsvpkys => 
     {
       return rsvpkys.sort(function(a,b){
         //console.log("b.$key = "+ b.$key+ "a.$key = " +a.$key);
         //console.log("b.time = "+ b.time+ "a.time = " +a.time);
         // var moment = require('moment');
         // console.log(moment(b.time).isAfter(a.time));
         // console.log(btime<atime);
        var btime = new Date(b.time);
        var atime = new Date(a.time);
        return btime<atime ? 1:-1; 
        // return moment(b.time).isAfter(a.time);
      })
     });
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
