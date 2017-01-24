import { Component, OnInit,EventEmitter,Output } from '@angular/core';
import{EventsService} from '../shared/model/events.service';
import{GauntletEvent} from '../shared/model/gauntletEvent';
import {AuthService} from "../shared/security/auth.service";
import {AuthInfo} from "../shared/security/auth-info";
import {Observable,Subject} from "rxjs/Rx";
// import { Http, Headers, RequestOptions } from "@angular/http";
import {Http, Response, RequestOptions, Headers, Request, RequestMethod} from '@angular/http';
import "rxjs/Rx";

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

    public recipient: string;
    public subject: string;
    public message: string;
    private mailgunUrl: string = "sandboxc5c9e5273c6d427981361947fdf91b7d.mailgun.org";
    private apiKey: string = "a2V5LTVjM2Q0Y2VjMDcyMWE4NmQ4NWM4YzBkYjlkMzk2MDlk";

  constructor(
    private http: Http,
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
