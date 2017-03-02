import { Injectable } from '@angular/core';
import {AngularFireDatabase,AngularFire,FirebaseListObservable,FirebaseRef} from "angularfire2";
import {GauntletEvent} from "./gauntletEvent";
import {User} from "./user";
import {Observable,Subject} from "rxjs/Rx";
import {Http, Response, RequestOptions, Headers, Request, RequestMethod} from '@angular/http';

@Injectable()
export class EmailService {

  constructor(
  	private af: AngularFire,
  	private http: Http,) { }

sendRSVPUpdateEmailFromKey(userKey:string,eventKey:string) {

this.af.database.object('events/'+eventKey).map(GauntletEvent.fromJson).first()

  // this.af.database.list('events/eventKey').map(GauntletEvent.fromJsonList).first()
  .subscribe(
  	event => {
  		console.log("sendRSVPUpdateEmail userKey = "+userKey+" eventKey = "+eventKey);
  		// console.log(event);

  		this.af.database.object('users/'+userKey).map(User.fromJson).first()
  			.subscribe(
			  	user => {
			  		// console.log("sendRSVPUpdateEmail userKey = "+userKey+" eventKey = "+eventKey);
			  		// console.log(user);
			  		// console.log(event.title+user.displayName+user.email+event.eventStartTime);
            var moment = require('moment');
            var dateTime = moment(event.eventStartTime).local().format("dddd, MMMM Do YYYY, h:mm a").toString();
			  		this.sendRSVPEmail(user.email,user.displayName,event.title,dateTime)
			  	});

  	});
} 

sendRSVPEmail(email,displayName,title,eventStartTime){
  var emailTo = email;
  var subject = "Congrats " +displayName+"! Your RSVP list has been updated!";
  var body = "You are now attending "+ title + " which starts at " + eventStartTime;
  this.sendEmailTo(emailTo,subject,body);
}

sendEmailTo(emailTo:string,subject:string,body:string){
  // console.log("sendEmailTo !!!!!!!!!!!!!!!!!" +body);
  var url:string = "https://emailserver-153100.appspot.com/";
  this.http.get(url+"?emailTo="+emailTo+"&subject="+subject+"&body="+body)
  .catch((err:any) =>{ 
      console.log("Something is wrong..");
      return Observable.of(undefined);
           }).do(console.log).subscribe(
    res => { console.log(res)},
    err => { console.log("ERROR"+err)}
    );
}

}
