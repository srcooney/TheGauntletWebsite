import { Component, OnInit } from '@angular/core';
import{UserService} from '../shared/model/user.service';
import {AuthService} from "../shared/security/auth.service";
@Component({
  selector: 'app-my-account',
  templateUrl: './my-account.component.html',
  styleUrls: ['./my-account.component.css']
})
export class MyAccountComponent implements OnInit {
	
	auth: any;

	userRsvps : any;

  constructor(
  	private userService:UserService,
  	private authService:AuthService) { }

  ngOnInit() {

  	this.authService.auth
     .subscribe(auth => this.auth = auth);

     this.getRsvpList(this.auth.uid);
  }

  getRsvpList (uid:string){
  	this.userService.getRsvpListFromUid(uid)
  	.do(console.log)
  	.subscribe( rsvpList => this.userRsvps = rsvpList);

  }


}
