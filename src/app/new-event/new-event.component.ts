import { Component, OnInit } from '@angular/core';
import{EventsService} from '../shared/model/events.service';
import {AuthService} from "../shared/security/auth.service";
import {AuthInfo} from "../shared/security/auth-info";
@Component({
  selector: 'app-new-event',
  templateUrl: './new-event.component.html',
  styleUrls: ['./new-event.component.css']
})
export class NewEventComponent implements OnInit {
  authInfo: AuthInfo;
  constructor(
    private authService:AuthService,
    private eventsService: EventsService) { }

  ngOnInit() {

    this.authService.authInfo$.subscribe(authInfo =>  this.authInfo = authInfo);
  }

  uploading = false;

  save(form) {
    this.uploading = true;
    console.log(this.file);
      this.eventsService.createNewEvent(form.value,this.file,this.authInfo).do(console.log)
          .subscribe(
              () => {
                alert("Event created succesfully.");
                this.eventsService.routeToEvents();
              },
              err => alert(`error creating lesson ${err}`)
          );

  }
  file;
  handleFileUpdated(file){
    console.log("handleFileUpdated")
    console.log(file);
    this.file = file
  }

}
