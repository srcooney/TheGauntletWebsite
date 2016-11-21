import { Component, OnInit, Input, OnChanges, SimpleChanges} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
@Component({
  selector: 'event-form',
  templateUrl: './event-form.component.html',
  styleUrls: ['./event-form.component.css']
})
export class EventFormComponent implements OnInit {
	
	form:FormGroup;

  
  constructor(private fb:FormBuilder) {
  	this.form = this.fb.group({
				title: ['',Validators.required],
        description: ['',Validators.required],
        longDescription: ['']
    });

   }

  ngOnInit() {
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
