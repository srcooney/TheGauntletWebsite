import { Component, OnInit } from '@angular/core';
import {AuthService} from "../shared/security/auth.service";
import {AuthInfo} from "../shared/security/auth-info";
@Component({
  selector: 'top-menu',
  templateUrl: './top-menu.component.html',
  styleUrls: ['./top-menu.component.css']
})
export class TopMenuComponent implements OnInit {
	auth: any;
  user: any;
  authInfo: AuthInfo;
  constructor(private authService:AuthService) {
  
   }
   user$;
  ngOnInit() {
    this.authService.authInfo$.subscribe(authInfo =>  this.authInfo = authInfo);
  }

  login(){
    const login = this.authService.login().first()
    .subscribe(auth =>
      {
        if(!this.authInfo.isLoggedIn()){
          this.authService.createNewUser();
        }
      });
    
  }

  logout(){
  	this.authService.logout();
  }

}
