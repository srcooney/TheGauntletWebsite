import { Component, OnInit } from '@angular/core';
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
  
  rsvpTitle : any;
  rsvpTitles: any;
  
  eventWaitlists:any;

  waitlistTitle : any;
  waitlistTitles: any;

  eventComments:any;
  dateTime:any;

  emailButtonText:string = "Show Emails";

  constructor(
    private authService:AuthService,
    private router:Router,
  	private eventsService: EventsService,
  	private route: ActivatedRoute,) { }
  
  ngOnInit() {

    this.eventRsvps = [{displayName:"None",email:"None"}];
    this.eventWaitlists = [{displayName:"None",email:"None"}];
    this.authService.authInfo$.subscribe(authInfo =>  this.authInfo = authInfo);

  	const eventId = this.route.snapshot.params['id'];
  	this.eventsService.getEventById(eventId)
  	.subscribe(event => 
      {
        this.event = event;
        this.getRsvps(event.$key);
        this.getWaitLists(event.$key);
        var moment = require('moment');
        this.dateTime = moment(event.eventStartTime).local().format("dddd, MMMM Do YYYY, h:mm:ss a z").toString();
      }
      );

    this.rsvpTitle = "Rsvps";
    this.waitlistTitle = "Waitlists";
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

  getWaitLists (eventKey:string){
    this.eventsService.getWaitListsFromEventKey(eventKey)
      .subscribe(eventWaitlists => 
        {
          this.eventWaitlists = eventWaitlists;
          this.waitlistTitles = eventWaitlists.map(user => user.displayName)
        });
  }

  getRsvps (eventKey:string){
    this.eventsService.getRsvpsFromEventKey(eventKey)
      .subscribe(eventRsvps =>
        { 
          this.eventRsvps = eventRsvps;
          this.rsvpTitles = eventRsvps.map(user => user.displayName);
        });
  }

  addToRsvp(eventKey:string, userDisplayName:string,currNumUsers:number,userRow){
    if(this.authInfo.isEventCreator() && this.eventWaitlists[0].displayName != "None"){
      userRow.remove();
      const userKeyObj = this.eventWaitlists.filter(user => user.displayName == userDisplayName);
      const userKey = userKeyObj[0].$key;
      this.eventsService.moveWaitlistToRsvp(eventKey,userKey,currNumUsers);
    }
  }

  // rsvp_button_clicked(){
  //   console.log("rsvp_button clicked")
  //   window.location.reload()
  //   // this.eventsService.routeToEventDetail(this.event.$key);
  // }

}
