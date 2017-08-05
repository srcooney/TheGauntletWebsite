import { Component, OnInit, Input, OnChanges, SimpleChanges, Output, EventEmitter} from '@angular/core';
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

  @Input()
    isEdit: boolean = false;

  constructor(private fb:FormBuilder) {
    if(this.isEdit)
    {
      this.form = this.fb.group({
        title: ['',Validators.required],
        description: ['',Validators.required],
        eventStartTime: ['',[Validators.required,validateDate]],
        allAccessTime: ['',[Validators.required,validateDate]],
        maxNumUsers: ['',Validators.required],
        imageURL: ['']
    });
    }
    else 
    {
      this.form = this.fb.group({
        title: ['',Validators.required],
        description: ['',Validators.required],
        eventStartTime: ['',[Validators.required,validateDate]],
        allAccessTime: [''],
        maxNumUsers: ['',Validators.required],
        imageURL: ['']
    });
    }
  	

   }

  ngOnInit() {
    if(this.eventStartTime == undefined && this.allAccessTime == undefined){
      this.eventStartTime="";
      this.allAccessTime="";
    };
  }
  file:any;
  @Output() fileUpdated = new EventEmitter();
  uploadFile(input){
    console.log(input.files[0]);
    this.file = input.files[0];
    this.fileUpdated.emit(this.file);
    // console.log(this.form);
    // // this.form.controls['image'].updateValue(input);
    // // this.form.patchValue(changes['initialValue'].currentValue);
    // this.form.controls['image'].setValue(input);
    // // this.form.image.updateValue(input);
    // console.log(this.form);
    // this.form.patchValue({image: input.files[0]});
    // console.log(this.form);
  }

  ngOnChanges(changes:SimpleChanges) {
    console.log(changes)
        if (changes['initialValue']) {
            var imageURL = changes['initialValue'].currentValue.imageURL;
            changes['initialValue'].currentValue.imageURL = "";
            console.log(changes['initialValue'].currentValue);
            this.form.patchValue(changes['initialValue'].currentValue);
            changes['initialValue'].currentValue.imageURL = imageURL;
            console.log(changes['initialValue'].currentValue);
            var moment = require('moment');
            this.eventStartTime = moment(changes['initialValue'].currentValue.eventStartTime).format('MM/DD/YYYY HH:mm').toString();
            this.allAccessTime = moment(changes['initialValue'].currentValue.allAccessTime).format('MM/DD/YYYY HH:mm').toString();
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

  help(){
    alert(
"1. Only use positive whole numbers for the 'Max Number of Users.'\n"+
"2. Carefully match the Date Time Format. MM/DD/YYYY HH:mm (24 hour).\n"+
"3. If the Date Time Format is not working, try clicking on the calendar pop up again. If that is frozen, refresh the page.\n")
  }

}
