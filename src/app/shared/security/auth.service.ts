import { Injectable,Inject } from '@angular/core';
import {Observable, Subject, BehaviorSubject} from "rxjs/Rx";
import {AuthInfo} from "./auth-info";
import {Router} from "@angular/router";
import{UserService} from '../model/user.service';
import {FirebaseRef,AngularFire,AngularFireAuth,AuthMethods,AuthProviders,FirebaseAuthState} from "angularfire2";

@Injectable()
export class AuthService {


  static UNKNOWN_USER = new AuthInfo(null);

  authInfo$: BehaviorSubject<AuthInfo> = new BehaviorSubject<AuthInfo>(AuthService.UNKNOWN_USER);

  sdkDb:any;

  constructor(
    private userService: UserService,
    private auth: AngularFireAuth,
    private router:Router,
    @Inject(FirebaseRef) fb) {

      this.sdkDb = fb.database().ref();

      this.auth.subscribe( auth =>
      {
        if(auth){
          this.userService.findUserbyUid(auth.uid)
            .first()
            .subscribe(
              user => 
              {
                const authInfo = new AuthInfo(user);
                this.authInfo$.next(authInfo);
              });
          }
        });
  }

  createNewUser() {
        // console.log(this.authuser);
        // if(this.authuser != null ){
        this.auth.first().subscribe( auth =>
        {
          const userToSave = Object.assign(
          {
            uid:auth.uid,
            displayName: auth.auth.displayName,
            email: auth.auth.email,
            admin: false,
            eventCreator: false,
            patreon7Member: false,
          });

        const newUserKey = this.sdkDb.child('users').push().key;

        let dataToSave = {};

        dataToSave["users/" + newUserKey] = userToSave;
        dataToSave["rsvpPerUser/" + newUserKey] = {default:true};
        this.firebaseUpdate(dataToSave);
        });

      // }
  }

    login():Observable<FirebaseAuthState> {
        return this.fromFirebaseAuthPromise(this.auth.login({provider: AuthProviders.Google,method: AuthMethods.Popup}));
    }

    /*
     *
     * This is a demo on how we can 'Observify' any asynchronous interaction
     *
     *
     * */

    fromFirebaseAuthPromise(promise):Observable<any> {

        const subject = new Subject<any>();

        promise
            .then(res => {
              this.auth.first().subscribe( auth =>
                  {
                     
                    if(auth) {
                      this.userService.findUserbyUid(auth.uid)
                    .do(result => console.log("user",result))
                    .first()
                    .subscribe(
                      user => 
                      {
                        const authInfo = new AuthInfo(user);
                        this.authInfo$.next(authInfo);
                        subject.next(res);
                        subject.complete();
                      });
                    }
                    
                  });
                },
                err => {
                    this.authInfo$.error(err);
                    subject.error(err);
                    subject.complete();
                });

        return subject.asObservable();
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


    logout() {
        this.auth.logout();
        this.authInfo$.next(AuthService.UNKNOWN_USER);
        // this.router.navigate(['/home']);

    }

}
