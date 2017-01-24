import { Component, OnInit, Input, OnChanges, SimpleChanges} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {FormControl} from "@angular/forms";
import {validateDate} from "../shared/validators/validateDate";
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
        eventStartTime: ['',[Validators.required,validateDate]],
        allAccessTime: ['',[Validators.required,validateDate]],
        maxNumUsers: ['',Validators.required]
    });

   }

  ngOnInit() {
    if(this.eventStartTime == undefined && this.allAccessTime == undefined){
      this.eventStartTime="";
      this.allAccessTime="";
    };
  }

  ngOnChanges(changes:SimpleChanges) {
    console.log(changes)
        if (changes['initialValue']) {
            this.form.patchValue(changes['initialValue'].currentValue);
            var moment = require('moment');
            this.eventStartTime = moment(changes['initialValue'].currentValue.eventStartTime).format('DD/MM/YYYY HH:mm').toString();
            this.allAccessTime = moment(changes['initialValue'].currentValue.allAccessTime).format('DD/MM/YYYY HH:mm').toString();
        }
    }

  isErrorVisible(field:string, error:string) {
      if(error == "dateTimeValid"){
        if(this.form.controls[field].touched){
          return this.validateDateTimeString(this.form.controls[field].value);
        }
      }else {
        return this.form.controls[field].dirty
              && this.form.controls[field].errors &&
              this.form.controls[field].errors[error];

      }
      
  }

  validateDateTimeString(value:string) {
    var moment = require('moment');
    return !moment(value, 'MM/DD/YYYY HH:mm', true).isValid();
  }

  validateDateTime(ctrl:FormControl) {
    const dateTimeValue = ctrl.value;
    var moment = require('moment');
    return moment(dateTimeValue, 'MM/DD/YYYY HH:mm', true).isValid();
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
