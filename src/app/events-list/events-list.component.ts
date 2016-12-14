import { Component, OnInit,EventEmitter,Output } from '@angular/core';
import{EventsService} from '../shared/model/events.service';
import{GauntletEvent} from '../shared/model/gauntletEvent';
import {AuthService} from "../shared/security/auth.service";
import {AuthInfo} from "../shared/security/auth-info";

@Component({
  selector: 'events-list',
  templateUrl: './events-list.component.html',
  styleUrls: ['./events-list.component.css']
})
export class EventsListComponent implements OnInit {
  authInfo: AuthInfo;
	allEvents:GauntletEvent[];
  filteredEvents:GauntletEvent[];
  auth: any;
  user: any;
  constructor(
  	private eventsService: EventsService,
    private authService:AuthService,
    ) { 

  }

  @Output('gEvent')
  gEventEmitter = new EventEmitter<GauntletEvent>();
  
  ngOnInit() {
    this.authService.authInfo$.subscribe(authInfo =>  this.authInfo = authInfo);

  	this.eventsService.findAllEvents()
     .subscribe(
        events => this.allEvents = this.filteredEvents = events
      );
  }

  selectEvent(gEvent: GauntletEvent){
  	this.gEventEmitter.emit(gEvent);
  }

  search(search:string){
    this.filteredEvents = this.allEvents.filter(event => event.title.includes(search));
  }

  routeToEventDetail(eventKey:string){
    this.eventsService.routeToEventDetail(eventKey);
  }

}
