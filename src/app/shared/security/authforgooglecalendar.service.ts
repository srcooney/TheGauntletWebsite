import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import {FirebaseRef,AngularFire,AngularFireAuth,AuthMethods,AuthProviders,FirebaseAuthState} from "angularfire2";
import { delay } from 'q';

//import { AngularFireAuth } from '@angular/fire/auth';
//import { auth } from 'firebase/app';

declare var gapi: any;

@Injectable()

export class AuthforgooglecalendarService {
  
  user$: Observable<firebase.User>; 
  calendarItems: any[];

  constructor(public afAuth: AngularFireAuth) { 
    this.initClient();
    //this.user$ = afAuth.authState;  
}

  // Initialize the Google API client with desired scopes
  initClient() {
    gapi.load('client', () => {
      // It's OK to expose these credentials, they are client safe.
      gapi.client.init({
        apiKey: 'AIzaSyClszV0mqDVQQb7VScS_U_VqtMYoodRRKM',
        clientId: '130540301642-6mvj2njqe7gm72i5ativecqhdobg5n6g.apps.googleusercontent.com',//'769079741822-uk80invov71nc3fm4tt4fu0fpeb2avs6.apps.googleusercontent.com',
        discoveryDocs: ['https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest'],
        scope: 'https://www.googleapis.com/auth/calendar'
      })

      gapi.client.load('calendar', 'v3', () => 'loaded calendar');

    });
  }

  async login() {
    const googleAuth = gapi.auth2.getAuthInstance()
    const googleUser = await googleAuth.signIn();
  
    const token = googleUser.getAuthResponse().id_token;
  
  
    //const credential = auth.GoogleAuthProvider.credential(token);
  
    //await this.afAuth.auth.signInAndRetrieveDataWithCredential(credential);
  
  
    // Alternative approach, use the Firebase login with scopes and make RESTful API calls
    // const provider = new auth.GoogleAuthProvider()
    // provider.addScope('https://www.googleapis.com/auth/calendar');
    // this.afAuth.auth.signInWithPopup(provider)
    
  }
  
  logout() {
    //this.afAuth.auth.signOut();
  }
  hoursFromNow = (n) => new Date(Date.now() + n * 1000 * 60 * 60 ).toISOString();

  async insertEvent(event,ele,title: string, descriptionText: string, start: Date) {
    event.stopPropagation();
    var moment = require('moment');
    var momentStart = moment(start);
    var momentEnd = moment(start).add(1, 'hour');;
    console.log(momentStart.format().toString());
    console.log(start);
    //end.setHours(end.getHours()+1)
    const insert = await gapi.client.calendar.events.insert({
      calendarId: 'primary',
      start: {
        dateTime: momentStart.format().toString()
      }, 
      end: {
        dateTime: momentEnd.format().toString()
      }, 
      summary: title,
      description: descriptionText
    }).then((value) => {
      if(value.status!= 200){
        ele.setAttribute('data-original-title',  "error: " + value.status);
        $(ele).tooltip('hide').addClass('btn btn-danger');
        $(ele).tooltip('show')
        setTimeout(()=>{$(ele).tooltip('hide')}, 1000)
      }
      else{
        ele.setAttribute('data-original-title',  "success" );
        $(ele).tooltip('hide').addClass('btn btn-success');
        $(ele).tooltip('show')
        setTimeout(()=>{$(ele).tooltip('hide')}, 1000)
      }
});
  }

  
}