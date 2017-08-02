// import { Injectable,Inject } from '@angular/core';
// import {Observable, Subject, BehaviorSubject} from "rxjs/Rx";

// import {Router} from "@angular/router";

// import {User} from "../model/user";
// import {FirebaseRef,AngularFire,AngularFireAuth,AuthMethods,AuthProviders,FirebaseAuth} from "angularfire2";
// import{UserService} from '../model/user.service';
// @Injectable()
// export class AuthService {
// sdkDb:any;
// user:any;
// auth1:any;
// authuser:any;
//   // static UNKNOWN_USER = new AuthInfo(null);

//   // authInfo$: BehaviorSubject<AuthInfo> = new BehaviorSubject<AuthInfo>(AuthService.UNKNOWN_USER);

//   // provider : any;
//   constructor(
//     private userService: UserService,
//     private af: AngularFire,
//     public auth: AngularFireAuth, 
//     private router:Router,
//     @Inject(FirebaseRef) fb) {
//     this.sdkDb = fb.database().ref();
//     // this.auth.subscribe(auth => this.authuser = auth);
    
//   }

//   ngOnInit() {

//     // var user = this.auth;
//   }

//   getUser() {

//     // const auth = this.auth;

//     // const user = this.userService.findUserbyUid(auth.uid);
//     // return user;
//     // this.auth.subscribe(auth =>
//     //   { 
//     //     // this.auth1 = auth;
//     //     this.userService.findUserbyUid(auth.uid)
//     //     .do(result => console.log("user",result))
//     //     .first()
//     //     .subscribe(
//     //       // user => {return user;}
//     //       );

//     //   });

//     // return this.auth.map(auth =>{
//     //   return this.userService.findUserbyUid(auth.uid)
//     //   .map(user => {
//     //     return user;
//     //   }).flatMap(fbojs => Observable.combineLatest(fbojs) )
//     // })

//     const authUidObs = this.auth
//     .map(auth => 
//     {
//       console.log("auth",auth)
//       if(auth != null){return auth.uid}
//       else {return null} 
//     })

//     // console.log("authUidObs",authUidObs);
//     // if(authUidObs == null)
//     //   return null;

//     const userObs = this.userService.findUserbyUidObs(authUidObs)
//     // // .do(console.log).subscribe()
//     return userObs;
//   }
  

//   login(){
//     return this.auth.login({
//       provider: AuthProviders.Google,
//       method: AuthMethods.Popup
//     })
//     // .then(
//     //   user => {
//     //     console.log(user)
//     //     return this.userService.findUserbyUid(user.uid)
//     //     .do(console.log)
//     //     // .first()
//     //     .subscribe(
//     //       userExistsAlready => 
//     //       {
//     //         if(userExistsAlready == undefined){
//     //           console.log("does not already exist")
//     //           this.createNewUser(user);
//     //         } else{
//     //           console.log("user already exists")
//     //         }
//     //         return true;
//     //       }
//     //       )
//     //     }
//     // );
//   }

//   logout(){
//     console.log("logout");
//     this.auth.logout();
//   }
  
//    user$ : any;
//   createNewUser() {
//         console.log(this.authuser);
//         // if(this.authuser != null ){
//         this.auth.subscribe( auth =>
//         {
//                     const userToSave = Object.assign(
//           {
//             uid:auth.uid,
//             displayName: auth.auth.displayName,
//             email: auth.auth.email,
//             admin: false,
//             eventCreator: false,
//             registered: false,
//           });

//         const newUserKey = this.sdkDb.child('users').push().key;

//         let dataToSave = {};

//         dataToSave["users/" + newUserKey] = userToSave;

//         this.firebaseUpdate(dataToSave);
//         });

//       // }
//   }



//   firebaseUpdate(dataToSave) {
//       const subject = new Subject();

//       this.sdkDb.update(dataToSave)
//           .then(
//               val => {
//                   subject.next(val);
//                   subject.complete();

//               },
//               err => {
//                   subject.error(err);
//                   subject.complete();
//               }
//           );

//       return subject.asObservable();
//   }

//   findUserByUid(uid:string):Observable<User> {
//         return this.af.database.list('users', {
//             query: {
//                 orderByChild: 'uid',
//                 equalTo: uid
//             }
//         })
//         .filter(results => results && results.length > 0)
//         .map(results => User.fromJson(results[0]))
//         .do(console.log);
//     }


// }
