import { Injectable,Inject } from '@angular/core';
import {AngularFireDatabase,AngularFire,FirebaseListObservable,FirebaseRef} from "angularfire2";
import {GauntletEvent} from "./gauntletEvent";
import {Observable,Subject} from "rxjs/Rx";
@Injectable()
export class EventsService {

	sdkDb:any;

  constructor(
  	private db:AngularFireDatabase,
  	private af: AngularFire,
  	@Inject(FirebaseRef) fb,) {
			this.sdkDb = fb.database().ref();
  	}

	findAllEvents():Observable<GauntletEvent[]> {
        return this.db.list('events').map(GauntletEvent.fromJsonList);
  } 

  createNewEvent( event:any): Observable<any> {

      const eventToSave = Object.assign(event);

      const newEventKey = this.sdkDb.child('events').push().key;

      let dataToSave = {};

      dataToSave["events/" + newEventKey] = eventToSave;

      return this.firebaseUpdate(dataToSave);
  }

  firebaseUpdate(dataToSave) {
      const subject = new Subject();

      this.sdkDb.update(dataToSave)
          .then(
              val => {
                  subject.next(val);
                  subject.complete();

              },
              err => {
                  subject.error(err);
                  subject.complete();
              }
          );

      return subject.asObservable();
  }

  saveRsvp(eventKey: string,uid:string) {
    let dataToSave = {};
      dataToSave[`rsvpPerEvent/${eventKey}/${uid}`] = true;
      dataToSave[`rsvpPerUser/${uid}/${eventKey}`] = true;
      return this.firebaseUpdate(dataToSave);
  }
}
