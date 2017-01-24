import { Component, OnInit } from '@angular/core';
import{EventsService} from '../shared/model/events.service';
@Component({
  selector: 'app-new-event',
  templateUrl: './new-event.component.html',
  styleUrls: ['./new-event.component.css']
})
export class NewEventComponent implements OnInit {

  constructor(private eventsService: EventsService) { }

  ngOnInit() {
  }

  save(form) {
      this.eventsService.createNewEvent(form.value)
          .subscribe(
              () => {
                alert("Event created succesfully.");
                this.eventsService.routeToEvents();
              },
              err => alert(`error creating lesson ${err}`)
          );

  }

}
