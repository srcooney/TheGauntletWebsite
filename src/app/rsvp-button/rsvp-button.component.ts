import { Component, OnInit,Input } from '@angular/core';
import{UserService} from '../shared/model/user.service';
import{EventsService} from '../shared/model/events.service';
import{GauntletEvent} from '../shared/model/gauntletEvent';
import {AuthService} from "../shared/security/auth.service";
import {AuthInfo} from "../shared/security/auth-info";

import {Http, Response}           from '@angular/http';
import {Headers, RequestOptions}  from '@angular/http';
import {Observable,Subject} from "rxjs/Rx";
@Component({
  selector: 'rsvp-button',
  templateUrl: './rsvp-button.component.html',
  styleUrls: ['./rsvp-button.component.css']
})
export class RsvpButtonComponent implements OnInit {

	@Input()
  event: GauntletEvent;
  auth: any;
  user: any;
  isRsvped: any;
  isRoom: boolean;
  isWaiting: any;
  button_text: string;
  label_text: string;

  disablebutton:boolean;
  allAccessString:string;

  authInfo: AuthInfo;

// isChrome;
isSafari;
  constructor(
    private _http: Http,
    private userService: UserService,
  	private eventsService: EventsService,
    private authService:AuthService,) { }

clicked = false;
  ngOnInit() {

    // this.isChrome = /Chrome/.test(navigator.userAgent) && /Google Inc/.test(navigator.vendor);
    this.isSafari = /Safari/.test(navigator.userAgent) && /Apple Computer/.test(navigator.vendor);


    this.authService.authInfo$.subscribe(authInfo =>
      {
        this.authInfo = authInfo;
      if(authInfo.isLoggedIn()) {
        var moment = require('moment-timezone');
        this.allAccessString = moment(this.event.allAccessTime).fromNow();
        this.disablebutton = !this.allAccessString.includes("ago") && !authInfo.isPatreon7Member() || this.isSafari;

       this.eventsService.getRsvpsKeysFromEventKey(this.event.$key).subscribe(
          userRsvps =>
         {

           userRsvps = userRsvps.filter(function( obj ) { return obj.$key !== 'default';})
           var index = userRsvps.findIndex(user => 
             {
               return user.$key === authInfo.key;
             });
           if(this.clicked){
             this.clicked = false;
           console.log("HEY")
           console.log(index);
           console.log(userRsvps);
           console.log("userRsvps.length " + userRsvps.length);
           for (var i=0;i < userRsvps.length;i++) {
             console.log("userRsvps[i].hasEmailed "+userRsvps[i].hasEmailed+" this.event.maxNumUsers "+this.event.maxNumUsers+"authInfo.key "+ authInfo.key);
             if(userRsvps[i].hasEmailed == false && i < this.event.maxNumUsers){ 
               console.log(userRsvps[i].hasEmailed)
               console.log(userRsvps[i])
               this.eventsService.sendEmailandUpdateEmailStat(userRsvps[i],this.event.$key)
             };
             // console.log(userRsvps[i])
           };
           };

           this.isRsvped = index != -1 && index < this.event.maxNumUsers;
           this.isRoom = userRsvps.length < this.event.maxNumUsers;
           this.isWaiting = index != -1 && index > this.event.maxNumUsers-1;



           console.log("this.event.$key "+this.event.$key+" this.isWaiting = "+this.isWaiting+" this.isRsvped = " + this.isRsvped +"  this.isRoom = "+this.isRoom);
           this.changeText();

         }
         );
     };
      }); 
  }

  changeText (){
    // console.log("changeText "+this.event.$key+" this.isWaiting = "+this.isWaiting+" this.isRsvped = " + this.isRsvped +"  this.isRoom = "+this.isRoom);
    if(this.disablebutton){
      if(this.isSafari){this.label_text = "Sorry RSVPing doesn't work with safari please use a different browser!"}
      else{this.label_text = "Non Patreon users can rsvp " + this.allAccessString;}
      this.button_text = "RSVP"
      return;
    }

    if(this.isRoom && !this.isRsvped) {
       this.label_text  = "";
       this.button_text = "RSVP";
     } else if(this.isRsvped) {
       this.label_text  = "Attending";
       this.button_text = "Cancel";
     }else if(!this.isRoom && !this.isWaiting) {
       this.label_text  = "";
       this.button_text = "RSVP to Waitlist";
     }else if(!this.isRoom && this.isWaiting) {
       this.label_text  = "Waitlisted";
       this.button_text = "Cancel";
     }
  }

  handleUser($event,eventKey,userKey){
    $event.stopPropagation();
    console.log("handleUser userKey"+userKey+"eventKey"+eventKey+" this.isWaiting = "+this.isWaiting+" this.isRsvped = " + this.isRsvped +"  this.isRoom = "+this.isRoom);
    // this.sendEmails();
    this.clicked = true;
    if(this.isRoom && !this.isRsvped)
      this.eventsService.saveRsvp(eventKey,userKey,this.event.currNumUsers);
    else if(this.isRsvped)
      this.eventsService.cancelRsvp(eventKey,userKey,this.event.currNumUsers);
    else if(!this.isRoom && !this.isWaiting)
      this.eventsService.saveRsvp(eventKey,userKey,this.event.currNumUsers);
    else if(!this.isRoom && this.isWaiting)
      this.eventsService.cancelRsvp(eventKey,userKey,this.event.currNumUsers);
  }

  // sentEmail:any =  false;
  // sendEmails(){
  //        var send_email_subscription = this.eventsService.getRsvpsKeysFromEventKey(this.event.$key).subscribe(
  //         userRsvps =>
  //        {
  //          userRsvps = userRsvps.filter(function( obj ) { return obj.$key !== 'default';})
  //          console.log("HEY")
  //          console.log(userRsvps);
  //          console.log("userRsvps.length " + userRsvps.length);
  //          for (var i=0;i < userRsvps.length;i++) {
  //            this.sentEmail = true;
  //            console.log("userRsvps[i].hasEmailed "+userRsvps[i].hasEmailed+" this.event.maxNumUsers "+this.event.maxNumUsers);
  //            if(userRsvps[i].hasEmailed == false && i < this.event.maxNumUsers){ 
  //              console.log(userRsvps[i].hasEmailed)
  //              console.log(userRsvps[i])
  //              this.eventsService.sendEmailandUpdateEmailStat(userRsvps[i],this.event.$key)
  //            };
  //            // console.log(userRsvps[i])
  //          };

  //        }
  //        );

  //        send_email_subscription.unsubscribe();
  // }
}
