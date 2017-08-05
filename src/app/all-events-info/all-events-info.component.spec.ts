import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AllEventsInfoComponent } from './all-events-info.component';

describe('AllEventsInfoComponent', () => {
  let component: AllEventsInfoComponent;
  let fixture: ComponentFixture<AllEventsInfoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AllEventsInfoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AllEventsInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
