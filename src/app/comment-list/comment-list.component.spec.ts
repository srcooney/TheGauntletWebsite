/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { CommentListComponent } from './comment-list.component';

describe('CommentListComponent', () => {
  let component: CommentListComponent;
  let fixture: ComponentFixture<CommentListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CommentListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CommentListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
