import { Component, OnInit,Inject } from '@angular/core';
import {AuthService} from "../shared/security/auth.service";


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
	auth: any;
  constructor(private authService:AuthService) {
  	this.auth = authService.auth;
}

  ngOnInit() {
  }

  login(){
  	this.authService.login();
  }

  logout(){
  	this.authService.logout();
  }

}
