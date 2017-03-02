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
  creatorList : any;

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
    // this.userRsvps = [{title:"None"}];
    // this.userWaitlists = [{title:"None"}];

    this.authService.authInfo$.subscribe(authInfo =>
      {
        this.authInfo = authInfo;
        if(this.authInfo.isLoggedIn()){
          this.getRsvpList(this.authInfo.key);
          this.userService.getCreatorListFromUserKey(this.authInfo.key).subscribe(creatorList => this.creatorList = creatorList);
        }
      });

     this.waitlistTitle = "My Waitlists";
     this.rsvpTitle = "My Rsvps";
  }

  getRsvpList (userKey:string){
  	this.userService.getRsvpListFromUserKey(userKey)
    .subscribe(eventList => 
      {
        console.log(eventList);
        this.userRsvps = eventList.filter(function( obj ) { return obj.$key !== 'default';})
        console.log(this.userRsvps);
        // this.userRsvps = eventList;
        // for(var i=0;i<eventList.length;i++){
        //   this.setEventToList(eventList[i]);
        // }
        // console.log("USERRSVPS")
        // console.log(this.userRsvps);
        // console.log(this.userWaitlists);
        // this.rsvpTitles = rsvpList.map(rsvpevent => rsvpevent.title);
        // this.rsvpRoutes = rsvpList.map(rsvpevent => "event-detail/"+rsvpevent.$key);
      });
  }


  setEventToList(event){
      this.eventsService.getRsvpsKeysFromEventKey(event.$key).first().subscribe(
          userRsvps =>
         {
           console.log("event")
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
}
