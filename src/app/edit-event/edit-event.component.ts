import { Component, OnInit } from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import{EventsService} from '../shared/model/events.service';
@Component({
  selector: 'app-edit-event',
  templateUrl: './edit-event.component.html',
  styleUrls: ['./edit-event.component.css']
})
export class EditEventComponent implements OnInit {
	event:any;
  constructor(
  	private eventsService: EventsService,
  	private route: ActivatedRoute,
  	) { }

  ngOnInit() {
  	const eventId = this.route.snapshot.params['id'];
  	this.eventsService.getEventById(eventId)
  	.subscribe(event => 
      {
        this.event = event;

      });
  }
  uploading = false;
  update(event,eventUpdate) {
    this.uploading = true;
      this.eventsService.updateEvent(event,eventUpdate,this.file);
      this.eventsService.routeToEventDetail(event.$key);
  }

  file;
  handleFileUpdated(file){
    this.file = file
  }

}
