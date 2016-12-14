import { Component, OnInit } from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import{EventsService} from '../shared/model/events.service';
import {Router} from "@angular/router";
@Component({
  selector: 'app-duplicate-event',
  templateUrl: './duplicate-event.component.html',
  styleUrls: ['./duplicate-event.component.css']
})
export class DuplicateEventComponent implements OnInit {
	event:any;
  constructor(
  	private eventsService: EventsService,
  	private route: ActivatedRoute,
  	private router:Router,
  	) { }

  ngOnInit() {
  	const eventId = this.route.snapshot.params['id'];
  	this.eventsService.getEventById(eventId)
  	.subscribe(event => 
      {
        this.event = event;

      });
  }

  createDuplicateEvent(form) {
      this.eventsService.createNewEvent(form.value)
          .subscribe(
              () => {
                  // alert("Event created succesfully. Create another lesson ?");
                  // form.reset();
              },
              err => alert(`error creating lesson ${err}`)
          );
      this.router.navigate(['events']);
  }

}
