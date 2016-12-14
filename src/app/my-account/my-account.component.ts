import { Component, OnInit } from '@angular/core';
import{UserService} from '../shared/model/user.service';
import {AuthService} from "../shared/security/auth.service";
import{EventsService} from '../shared/model/events.service';
import {AuthInfo} from "../shared/security/auth-info";
@Component({
  selector: 'app-my-account',
  templateUrl: './my-account.component.html',
  styleUrls: ['./my-account.component.css']
})
export class MyAccountComponent implements OnInit {
	
	auth: any;
  user: any;

	userRsvps : any;

  userWaitlists : any;


  rsvpTitle : any;
  rsvpTitles: any;
  rsvpRoutes: any;


  waitlistTitle : any;
  waitlistTitles: any;
  waitlistRoutes: any;

  authInfo: AuthInfo;
  constructor(
    private eventsService: EventsService,
  	private userService:UserService,
  	private authService:AuthService) { }

  ngOnInit() {
    this.userRsvps = [{title:"None"}];
    this.userWaitlists = [{title:"None"}];

    this.authService.authInfo$.subscribe(authInfo =>
      {
        this.authInfo = authInfo;
        if(this.authInfo.isLoggedIn()){
          this.getRsvpList(this.authInfo.key);
          this.getWaitLists(this.authInfo.key);
        }
      });

     this.waitlistTitle = "My Waitlists";
     this.rsvpTitle = "My Rsvps";
  }

  getRsvpList (userKey:string){
  	this.userService.getRsvpListFromUserKey(userKey)
    .subscribe(rsvpList => 
      {
        this.userRsvps = rsvpList;
        this.rsvpTitles = rsvpList.map(rsvpevent => rsvpevent.title);
        this.rsvpRoutes = rsvpList.map(rsvpevent => "event-detail/"+rsvpevent.$key);
      });
  }

  getWaitLists (userKey:string){
    this.userService.getWaitListsFromUserKey(userKey)
    .subscribe(
      waitlists => 
      {
        this.userWaitlists = waitlists;
        this.waitlistTitles = waitlists.map(waitlistevent => waitlistevent.title);
        this.waitlistRoutes = waitlists.map(waitlistevent => "event-detail/"+waitlistevent.$key);
      }
      );
  }

  routeToEventDetail(eventKey:string){
    this.eventsService.routeToEventDetail(eventKey);
  }
}
