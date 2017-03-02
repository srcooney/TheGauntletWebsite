import { Component, OnInit } from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import{EventsService} from '../shared/model/events.service';
import {Router} from "@angular/router";
import {AuthService} from "../shared/security/auth.service";
import {AuthInfo} from "../shared/security/auth-info";
@Component({
  selector: 'app-duplicate-event',
  templateUrl: './duplicate-event.component.html',
  styleUrls: ['./duplicate-event.component.css']
})
export class DuplicateEventComponent implements OnInit {
	event:any;
  authInfo: AuthInfo;
  constructor(
    private authService:AuthService,
  	private eventsService: EventsService,
  	private route: ActivatedRoute,
  	private router:Router,
  	) { }

  ngOnInit() {
    this.authService.authInfo$.subscribe(authInfo =>  this.authInfo = authInfo);
  	const eventId = this.route.snapshot.params['id'];
  	this.eventsService.getEventById(eventId)
  	.subscribe(event => 
      {
        this.event = event;

      });
  }

  createDuplicateEvent(form) {
      this.eventsService.createNewEvent(form.value,this.file,this.authInfo)
          .subscribe(
              () => {
                  // alert("Event created succesfully. Create another lesson ?");
                  // form.reset();
              },
              err => alert(`error creating lesson ${err}`)
          );
      this.router.navigate(['events']);
  }

  file;
  handleFileUpdated(file){
    console.log("handleFileUpdated")
    console.log(file);
    this.file = file
  }

}
