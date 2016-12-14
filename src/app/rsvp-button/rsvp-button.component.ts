import { Component, OnInit,Input } from '@angular/core';
import{UserService} from '../shared/model/user.service';
import{EventsService} from '../shared/model/events.service';
import{GauntletEvent} from '../shared/model/gauntletEvent';
import {AuthService} from "../shared/security/auth.service";
import {AuthInfo} from "../shared/security/auth-info";
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

  constructor(
    private userService: UserService,
  	private eventsService: EventsService,
    private authService:AuthService,) { }

  ngOnInit() {
    this.authService.authInfo$.subscribe(authInfo =>
      {
        this.authInfo = authInfo;
      if(authInfo.isLoggedIn()) {
        var moment = require('moment-timezone');
        this.allAccessString = moment(this.event.allAccessTime).fromNow();
        this.disablebutton = !this.allAccessString.includes("ago") && !authInfo.isPatreon7Member();

        this.userService.isWaitlistedToEvent(this.event.$key,authInfo.key)
       .subscribe(iswaiting => 
           {
             this.isWaiting = iswaiting
             this.changeText();
           });

       this.userService.isRsvpedToEvent(this.event.$key,authInfo.key)
       .subscribe(result =>
         {
           this.isRsvped = result
           this.isRoom = this.eventsService.isRoom(this.event);
           this.changeText();
       });
     };
      }); 
  }

  changeText (){
    // console.log("this.isWaiting = "+this.isWaiting+" this.isRsvped = " + this.isRsvped +"  this.isRoom = "+this.isRoom);
    if(this.disablebutton){
      this.label_text = "Non Patreon users can rsvp " + this.allAccessString;
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
    if(this.isRoom && !this.isRsvped)
      this.eventsService.saveRsvp(eventKey,userKey,this.event.currNumUsers);
    else if(this.isRsvped)
      this.eventsService.cancelRsvp(eventKey,userKey,this.event.currNumUsers);
    else if(!this.isRoom && !this.isWaiting) 
      this.eventsService.saveRsvpWaitlist(eventKey,userKey,this.event.currNumUsers);
    else if(!this.isRoom && this.isWaiting)
      this.eventsService.cancelRsvpWaitlist(eventKey,userKey,this.event.currNumUsers);

  }
}
