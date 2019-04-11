import { Component, OnInit,EventEmitter,Output } from '@angular/core';
import{EventsService} from '../shared/model/events.service';
import{GauntletEvent} from '../shared/model/gauntletEvent';
import {AuthService} from "../shared/security/auth.service";
import {AuthforgooglecalendarService} from "../shared/security/authforgooglecalendar.service";

import {AuthInfo} from "../shared/security/auth-info";
import {Observable,Subject, BehaviorSubject} from "rxjs/Rx";
import { delay } from 'q';
import { InfiniteScrollModule } from 'angular2-infinite-scroll';

// import { Http, Headers, RequestOptions } from "@angular/http";
import {Http, Response, RequestOptions, Headers, Request, RequestMethod} from '@angular/http';
import "rxjs/Rx";
//import {MatCardModule} from '@angular/material';

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
  imageUrl;

    public recipient: string;
    public subject: string;
    public message: string;
    private mailgunUrl: string = "sandboxc5c9e5273c6d427981361947fdf91b7d.mailgun.org";
    private apiKey: string = "a2V5LTVjM2Q0Y2VjMDcyMWE4NmQ4NWM4YzBkYjlkMzk2MDlk";

  constructor(
    private http: Http,
  	private eventsService: EventsService,
    private authService:AuthService,
    public authForCalendar: AuthforgooglecalendarService
    ) { 

  }

  @Output('gEvent')
  gEventEmitter = new EventEmitter<GauntletEvent>();
  
  numEventsToGet: number;
  ngOnInit() {
    $( document ).ready(function() {$('[data-toggle="tooltip"]').tooltip();});
    this.numEventsToGet = 5;
    this.authService.authInfo$.subscribe(authInfo =>  this.authInfo = authInfo);
  	this.getEvents(this.numEventsToGet);
  }

  getEvents(numEvents){
    this.eventsService.findEventsInfiniteScroll(numEvents)
     .subscribe(
        events => 
        {
          this.allEvents = this.filteredEvents = events;
          this.filteredEvents = this.eventsService.getAllFutureEvents(this.allEvents);
          delay(100).then(function(value) {
            //$('[data-toggle="popover"]').popover();
            //$('[data-toggle="tooltip"]').tooltip();
          });
          console.log(this.allEvents)
        }
      );
  }

  onScroll () {
    console.log('scrolled!!')
    this.numEventsToGet+=5;
    this.getEvents(this.numEventsToGet);
}

  selectEvent(gEvent: GauntletEvent){
  	this.gEventEmitter.emit(gEvent);
  }

  search(search:string){
    this.filteredEvents = this.allEvents.filter(event => event.title.toLowerCase().includes(search.toLowerCase()));
  }

  routeToEventDetail(eventKey:string){
    this.eventsService.routeToEventDetail(eventKey);
  }
}
