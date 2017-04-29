import { Component, OnInit,NgZone } from '@angular/core';
import{EventsService} from '../shared/model/events.service';
import {ActivatedRoute} from '@angular/router';
import {Router} from "@angular/router";
import {AuthService} from "../shared/security/auth.service";
import {User} from "../shared/model/user";
import {AuthInfo} from "../shared/security/auth-info";
@Component({
  selector: 'app-event-detail',
  templateUrl: './event-detail.component.html',
  styleUrls: ['./event-detail.component.css']
})
export class EventDetailComponent implements OnInit {
  authInfo: AuthInfo;
  user: any;
	event: any;
  
  eventRsvps:any;
  eventWaitlists:any;

  eventComments:any;
  dateTime:any;

  currentNumRsvps:any;
  imageURL:any;
  emailButtonText:string = "Show Emails";

  isThisEventCreator:boolean;

  constructor(
    private authService:AuthService,
    private router:Router,
  	private eventsService: EventsService,
  	private route: ActivatedRoute,
    public zone: NgZone,) { }
  
  ngOnInit() {
    this.authService.authInfo$.subscribe(authInfo =>  {
      this.authInfo = authInfo;


    const eventId = this.route.snapshot.params['id'];
    this.eventsService.getEventById(eventId)
    .subscribe(event => 
      {
        this.event = event;
        if(this.authInfo.isLoggedIn()){
          this.isThisEventCreator = event.eventCreator == this.authInfo.displayName;
        } else {
          this.isThisEventCreator = false;
        }
        
        this.eventsService.getUserKeysFromRsvpKeys(eventId).subscribe(
        users =>
        {
          users = users.filter(function( obj ) { return obj.$key !== 'default';})
          console.log(this.eventRsvps);
          console.log(this.eventWaitlists);
          this.eventRsvps = users.slice(0,this.event.maxNumUsers);
          this.eventWaitlists = users.slice(this.event.maxNumUsers);
          this.currentNumRsvps = this.eventRsvps.length;

          if(this.eventRsvps.length == 0){this.eventRsvps = [{displayName:"None",email:"None"}];};
          if(this.eventWaitlists.length == 0){this.eventWaitlists = [{displayName:"None",email:"None"}];};
        });
        var moment = require('moment');
        this.dateTime = moment(event.eventStartTime).local().format("dddd, MMMM Do YYYY, h:mm a").toString();
      }
      );



    }



      );

  	
  }

  removeEvent(eventKey:string){
    var confirm_element = confirm("Are you sure you want to delete this event?");
    if (confirm_element == true) {
        this.eventsService.removeEvent(eventKey);
        this.router.navigate(['events']);
    } else {
    }
  }

  editEvent(eventKey:string){
    this.router.navigate(['edit',eventKey]);
  }

  duplicateEvent(eventKey:string){
    this.router.navigate(['duplicate',eventKey]);
  }

  showEmails(){
    if(this.emailButtonText =="Show Emails"){this.emailButtonText = "Show User Names";} 
    else {this.emailButtonText ="Show Emails";}
  }  
  dropdownClicked = false;
  clickedDropDown(){
    this.dropdownClicked = !this.dropdownClicked;
  }

  // addToRsvp(eventKey:string, userDisplayName:string,currNumUsers:number,userRow){
  //   if(this.authInfo.isEventCreator() && this.eventWaitlists[0].displayName != "None"){
  //     userRow.remove();
  //     const userKeyObj = this.eventWaitlists.filter(user => user.displayName == userDisplayName);
  //     const userKey = userKeyObj[0].$key;
  //     this.eventsService.moveWaitlistToRsvp(eventKey,userKey,currNumUsers);
  //   }
  // }
}
