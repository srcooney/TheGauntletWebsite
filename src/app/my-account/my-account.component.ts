import { Component, OnInit } from '@angular/core';
import{UserService} from '../shared/model/user.service';
import {AuthService} from "../shared/security/auth.service";
import{EventsService} from '../shared/model/events.service';
import {AuthInfo} from "../shared/security/auth-info";
import {AuthforgooglecalendarService} from "../shared/security/authforgooglecalendar.service";

@Component({
  selector: 'app-my-account',
  templateUrl: './my-account.component.html',
  styleUrls: ['./my-account.component.css']
})
export class MyAccountComponent implements OnInit {
	
	auth: any;
  user: any;

	userRsvps : any;
  filteredUserRsvps;
  creatorList : any;
  filteredCreatorList : any;
  creatorTitlesOnly : any;

  userWaitlists : any;


  rsvpTitle : any;
  rsvpTitles: any;
  rsvpRoutes: any;


  waitlistTitle : any;
  waitlistTitles: any;
  waitlistRoutes: any;

  allEvents:any;

  authInfo: AuthInfo;

  pastOrFutureEvents: string = "Past Events";
  constructor(
    private eventsService: EventsService,
  	private userService:UserService,
    private authService:AuthService,
    public authForCalendar: AuthforgooglecalendarService) { }

  ngOnInit() {
    // this.userRsvps = [{title:"None"}];
    // this.userWaitlists = [{title:"None"}];
    $( document ).ready(function() {$('[data-toggle="tooltip"]').tooltip();});
  this.allEvents = []
    this.authService.authInfo$.subscribe(authInfo =>
      {
        this.authInfo = authInfo;
        if(this.authInfo.isLoggedIn()){
          this.getRsvpList(this.authInfo.key);
          this.userService.getCreatorListFromUserKey(this.authInfo.key).subscribe(creatorList => 
            {
              this.creatorList = creatorList;
              // this.creatorList = this.eventsService.getAllFutureEvents(this.creatorList);
              this.filteredCreatorList = this.eventsService.getAllFutureEvents(this.creatorList);
              this.creatorTitlesOnly = this.filteredCreatorList.map(e => e.title);
              this.allEvents.concat(this.filteredCreatorList)
            });
        }
      });

     this.waitlistTitle = "My Waitlists";
     this.rsvpTitle = "My Rsvps";
  }

  getRsvpList (userKey:string){
  	this.userService.getRsvpListFromUserKey(userKey)
    .subscribe(eventList => 
      {
        this.userRsvps = eventList.filter(function( obj ) { return obj.$key !== 'default';})
        this.filteredUserRsvps = this.eventsService.getAllFutureEvents(this.userRsvps);
        this.allEvents.concat(this.filteredUserRsvps)

      });
  }
  isCreator(title){
    return this.creatorTitlesOnly.includes(title);
  }

  setEventToList(event){
      this.eventsService.getRsvpsKeysFromEventKey(event.$key).first().subscribe(
          userRsvps =>
         {
           userRsvps = userRsvps.filter(function( obj ) { return obj.$key !== 'default';})
           var index = userRsvps.findIndex(user => {return user.$key === this.authInfo.key;});

           var isRsvped = index != -1 && index < event.maxNumUsers;
           var isWaiting = index != -1 && index > event.maxNumUsers-1;
           if(isRsvped){this.userRsvps.push(event)};
           if(isWaiting){this.userWaitlists.push(event)};
         }
         );
  }

  routeToEventDetail(eventKey:string){
    this.eventsService.routeToEventDetail(eventKey);
  }

  showPastEventsBool = false;

  showPastEvents(){
    this.showPastEventsBool = !this.showPastEventsBool;
    if(!this.showPastEventsBool) {
      this.pastOrFutureEvents = "Past Events";
      this.filteredUserRsvps = this.eventsService.getAllFutureEvents(this.userRsvps);
      this.filteredCreatorList = this.eventsService.getAllFutureEvents(this.creatorList);
    } else {
      this.pastOrFutureEvents = "Future Events";
      this.filteredUserRsvps = this.eventsService.getAllPastEvents(this.userRsvps);
      this.filteredCreatorList = this.eventsService.getAllPastEvents(this.creatorList);
    }
  }

  changeDisplayName(newDisplayName: string, displayNameEle)
  {
    this.userService.updateAttributeStatus(this.authInfo.key,"displayName",newDisplayName)
    .subscribe(result => {
    $(displayNameEle).tooltip('hide').addClass('btn btn-success');
    $(displayNameEle).tooltip('show');
    setTimeout(()=>{$(displayNameEle).tooltip('hide')}, 1000);
    });
    
  }
}
