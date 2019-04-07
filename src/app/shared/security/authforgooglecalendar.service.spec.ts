import { TestBed, inject } from '@angular/core/testing';

import { AuthforgooglecalendarService } from './authforgooglecalendar.service';

describe('AuthforgooglecalendarService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [AuthforgooglecalendarService]
    });
  });

  it('should ...', inject([AuthforgooglecalendarService], (service: AuthforgooglecalendarService) => {
    expect(service).toBeTruthy();
  }));
});
