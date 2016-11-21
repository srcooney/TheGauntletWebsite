import { Injectable,Inject } from '@angular/core';
import {Observable, Subject, BehaviorSubject} from "rxjs/Rx";

import {Router} from "@angular/router";

import {User} from "../model/user";
import {FirebaseRef,AngularFire,AngularFireAuth,AuthMethods,AuthProviders,FirebaseAuth} from "angularfire2";

@Injectable()
export class AuthService {
sdkDb:any;

  // static UNKNOWN_USER = new AuthInfo(null);

  // authInfo$: BehaviorSubject<AuthInfo> = new BehaviorSubject<AuthInfo>(AuthService.UNKNOWN_USER);

  // provider : any;
  constructor(
    private af: AngularFire,
    public auth: AngularFireAuth, 
    private router:Router,
    @Inject(FirebaseRef) fb) {
    this.sdkDb = fb.database().ref();
  }

  ngOnInit() {
    // var user = this.auth;
  }


  

  login(){
    this.auth.login({
      provider: AuthProviders.Google,
      method: AuthMethods.Popup
    }).then(
      result => {this.createNewUser(result.uid);}
    );
     // this.af.auth.subscribe(auth => console.log(auth));
  }



  logout(){
    this.auth.logout();
    // this.af.auth.subscribe(auth => console.log(auth));
  }
   user$ : any;
  createNewUser( user:any) {
        const userToSave = Object.assign({uid:user});

        const newUserKey = this.sdkDb.child('users').push().key;

        let dataToSave = {};

        dataToSave["users/" + newUserKey] = userToSave;

        this.firebaseUpdate(dataToSave);
      
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

  findUserByUid(uid:string):Observable<User> {
        return this.af.database.list('users', {
            query: {
                orderByChild: 'uid',
                equalTo: uid
            }
        })
        .filter(results => results && results.length > 0)
        .map(results => User.fromJson(results[0]))
        .do(console.log);
    }


}
