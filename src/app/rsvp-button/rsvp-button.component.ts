import { Component, OnInit,Input } from '@angular/core';
import{UserService} from '../shared/model/user.service';
import{EventsService} from '../shared/model/events.service';
import{GauntletEvent} from '../shared/model/gauntletEvent';
import {AuthService} from "../shared/security/auth.service";
import {AuthInfo} from "../shared/security/auth-info";

import {Http, Response}           from '@angular/http';
import {Headers, RequestOptions}  from '@angular/http';
import {Observable,Subject} from "rxjs/Rx";
@Component({
  selector: 'rsvp-button',
  templateUrl: './rsvp-button.component.html',
  styleUrls: ['./rsvp-button.component.css']
})
export class RsvpButtonComponent implements OnInit {

	@Input()
  event: GauntletEvent;
  auth: any;
  user: any;
  isRsvped: any;
  isRoom: boolean;
  isWaiting: any;
  button_text: string;
  label_text: string;

  disablebutton:boolean;
  allAccessString:string;

  authInfo: AuthInfo;

  constructor(
    private _http: Http,
    private userService: UserService,
  	private eventsService: EventsService,
    private authService:AuthService,) { }

  ngOnInit() {
    this.authService.authInfo$.subscribe(authInfo =>
      {
        this.authInfo = authInfo;
      if(authInfo.isLoggedIn()) {
        var moment = require('moment-timezone');
        this.allAccessString = moment(this.event.allAccessTime).fromNow();
        this.disablebutton = !this.allAccessString.includes("ago") && !authInfo.isPatreon7Member();

        this.userService.isWaitlistedToEvent(this.event.$key,authInfo.key)
       .subscribe(iswaiting => 
           {
             this.isWaiting = iswaiting
             this.changeText();
           });

       this.userService.isRsvpedToEvent(this.event.$key,authInfo.key)
       .subscribe(result =>
         {
           this.isRsvped = result
           this.isRoom = this.eventsService.isRoom(this.event);
           this.changeText();
       });
     };
      }); 
  }

  changeText (){
    // console.log("this.isWaiting = "+this.isWaiting+" this.isRsvped = " + this.isRsvped +"  this.isRoom = "+this.isRoom);
    if(this.disablebutton){
      this.label_text = "Non Patreon users can rsvp " + this.allAccessString;
      this.button_text = "RSVP"
      return;
    }

    if(this.isRoom && !this.isRsvped) {
       this.label_text  = "";
       this.button_text = "RSVP";
     } else if(this.isRsvped) {
       this.label_text  = "Attending";
       this.button_text = "Cancel";
     }else if(!this.isRoom && !this.isWaiting) {
       this.label_text  = "";
       this.button_text = "RSVP to Waitlist";
     }else if(!this.isRoom && this.isWaiting) {
       this.label_text  = "Waitlisted";
       this.button_text = "Cancel";
     }
  }

//   public static ClientResponse SendSimpleMessage() {
//     Client client = Client.create();
//     client.addFilter(new HTTPBasicAuthFilter("api",
//                 "key-5c3d4cec0721a86d85c8c0db9d39609d"));
//     WebResource webResource =
//         client.resource("https://api.mailgun.net/v3/sandboxc5c9e5273c6d427981361947fdf91b7d.mailgun.org/messages");
//     MultivaluedMapImpl formData = new MultivaluedMapImpl();
//     formData.add("from", "Mailgun Sandbox <postmaster@sandboxc5c9e5273c6d427981361947fdf91b7d.mailgun.org>");
//     formData.add("to", "steven <steven.r.cooney@gmail.com>");
//     formData.add("subject", "Hello steven");
//     formData.add("text", "Congratulations steven, you just sent an email with Mailgun!  You are truly awesome!  You can see a record of this email in your logs: https://mailgun.com/cp/log .  You can send up to 300 emails/day from this sandbox server.  Next, you should add your own domain so you can send 10,000 emails/month for free.");
//     return webResource.type(MediaType.APPLICATION_FORM_URLENCODED).
//                                                 post(ClientResponse.class, formData);
// }

//  private _contactUrl = '../shared/model/email.php';
 
//   sendEmail(){
//     const newMail = {name: 'Steven Cooney', email: 'steven.r.cooney/@gmail.com', message: 'Hey'};
//     console.log("email sent")
//     let body = `name=${newMail.name}&email=${newMail.email}&message=${newMail.message}`;
//     let headers = new Headers({ 'Content-Type': 'application/x-www-form-urlencoded' });
//     let options = new RequestOptions({ headers: headers });

//     return this._http.post(this._contactUrl, body, options)
//                     .map(res =>  <string> res.json())
//                     .do(console.log)
//                     .catch(this.handleError)
//   }

// private handleError (error: Response) {
//     // in a real world app, we may send the server to some remote logging infrastructure
//     // instead of just logging it to the console
//     console.error('Error in retrieving news: ' + error);
//     return Observable.throw(error.json().error || 'Server error');
//   }

//   sendEmail(){
//     var nodemailer = require("nodemailer");
 
// // create reusable transport method (opens pool of SMTP connections) 
// var smtpTransport = nodemailer.createTransport("SMTP",{
//     service: "Gmail",
//     auth: {
//         user: "gmail.user@gmail.com",
//         pass: "userpass"
//     }
// });
 
// // setup e-mail data with unicode symbols 
// var mailOptions = {
//     from: "Fred Foo ✔ <foo@blurdybloop.com>", // sender address 
//     to: "bar@blurdybloop.com, baz@blurdybloop.com", // list of receivers 
//     subject: "Hello ✔", // Subject line 
//     text: "Hello world ✔", // plaintext body 
//     html: "<b>Hello world ✔</b>" // html body 
// }
 
// // send mail with defined transport object 
// smtpTransport.sendMail(mailOptions, function(error, response){
//     if(error){
//         console.log(error);
//     }else{
//         console.log("Message sent: " + response.message);
//     }
 
//     // if you don't want to use this transport object anymore, uncomment following line 
//     //smtpTransport.close(); // shut down the connection pool, no more messages 
// });

//   }

  handleUser($event,eventKey,userKey){
    $event.stopPropagation();

    // this.sendEmail();
    // .do(console.log).subscribe();;
    if(this.isRoom && !this.isRsvped)
      this.eventsService.saveRsvp(eventKey,userKey,this.event.currNumUsers);
    else if(this.isRsvped)
      this.eventsService.cancelRsvp(eventKey,userKey,this.event.currNumUsers);
    else if(!this.isRoom && !this.isWaiting) 
      this.eventsService.saveRsvpWaitlist(eventKey,userKey,this.event.currNumUsers);
    else if(!this.isRoom && this.isWaiting)
      this.eventsService.cancelRsvpWaitlist(eventKey,userKey,this.event.currNumUsers);

  }
}
