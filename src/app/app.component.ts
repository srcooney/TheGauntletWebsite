import { Component, Inject } from '@angular/core';

// import {database, initializeApp} from "firebase";
import { AngularFire, FirebaseListObservable,FirebaseRef } from 'angularfire2';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

  title = 'app works!';
  items: FirebaseListObservable<any[]>;
  constructor(private af: AngularFire, @Inject(FirebaseRef) private fb) {

    // this.add_data();
    
  }

  add_data(){
    const sdkDb = this.fb.database().ref("events");

    for (var i = 0; i < 10; i++) {
    	sdkDb.push({
    	title: "Test Title "+i,
      description: "Test short description "+i,
      longDescription: "Test long description "+i
      });
    }

  }
}
