/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { EditEventComponent } from './edit-event.component';

describe('EditEventComponent', () => {
  let component: EditEventComponent;
  let fixture: ComponentFixture<EditEventComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditEventComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditEventComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
