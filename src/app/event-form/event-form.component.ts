import { Component, OnInit, Input, OnChanges, SimpleChanges} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
@Component({
  selector: 'event-form',
  templateUrl: './event-form.component.html',
  styleUrls: ['./event-form.component.css']
})
export class EventFormComponent implements OnInit,OnChanges {
	
	form:FormGroup;
  datetimevalue:any;
  numwoo:any;
  eventStartTime: string;
  allAccessTime: string;
  @Input()
    initialValue:any;
  constructor(private fb:FormBuilder) {
  	this.form = this.fb.group({
				title: ['',Validators.required],
        description: ['',Validators.required],
        eventStartTime: ['',Validators.required],
        allAccessTime: ['',Validators.required],
        maxNumUsers: ['',Validators.required]
    });

   }

  ngOnInit() {
  }

  ngOnChanges(changes:SimpleChanges) {
    console.log(changes)
        if (changes['initialValue']) {
            this.form.patchValue(changes['initialValue'].currentValue);
            var moment = require('moment-timezone');
            this.eventStartTime = moment(changes['initialValue'].currentValue.eventStartTime).tz("America/Chicago").format("YYYY-MM-DDTHH:mm").toString();
            this.allAccessTime = moment(changes['initialValue'].currentValue.allAccessTime).tz("America/Chicago").format("YYYY-MM-DDTHH:mm").toString();
        }
    }

  isErrorVisible(field:string, error:string) {

      return this.form.controls[field].dirty
              && this.form.controls[field].errors &&
              this.form.controls[field].errors[error];

  }

  reset() {
      this.form.reset();
  }


  get valid() {
      return this.form.valid;
  }

  get value() {
      return this.form.value;
  }

}
