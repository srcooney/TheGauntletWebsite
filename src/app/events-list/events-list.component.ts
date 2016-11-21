import { Component, OnInit,EventEmitter,Output } from '@angular/core';
import{EventsService} from '../shared/model/events.service';
import{GauntletEvent} from '../shared/model/gauntletEvent';
import {AuthService} from "../shared/security/auth.service";

@Component({
  selector: 'events-list',
  templateUrl: './events-list.component.html',
  styleUrls: ['./events-list.component.css']
})
export class EventsListComponent implements OnInit {

	allEvents:GauntletEvent[];
  auth: any;
  constructor(
  	private eventsService: EventsService,
    private authService:AuthService) { 

  }

  @Output('gEvent')
  gEventEmitter = new EventEmitter<GauntletEvent>();
  
  ngOnInit() {
  	this.eventsService.findAllEvents()
     .subscribe(
        events => this.allEvents  = events
      );

     this.authService.auth
     .subscribe(auth => this.auth = auth);
  }

  selectEvent(gEvent: GauntletEvent){
  	this.gEventEmitter.emit(gEvent);
  }

  rsvpUser(eventKey,uid){
    console.log(eventKey,uid);
    this.eventsService.saveRsvp(eventKey,uid)
  }

}
