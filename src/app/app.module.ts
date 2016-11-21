import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { AngularFireModule } from 'angularfire2';
import {firebaseConfig }   from '../environments/firebase.config';
import { AppComponent } from './app.component';
import { TopMenuComponent } from './top-menu/top-menu.component';
import {RouterModule} from "@angular/router";
import {routerConfig} from "./router.config";
import { EventsListComponent } from './events-list/events-list.component';
import {EventsService} from './shared/model/events.service';
import {UserService} from './shared/model/user.service';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/do';
import { NewEventComponent } from './new-event/new-event.component';
import { EventFormComponent } from './event-form/event-form.component';
import { ReactiveFormsModule } from '@angular/forms';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import {AuthService} from "./shared/security/auth.service";
import { MyAccountComponent } from './my-account/my-account.component';

@NgModule({
  declarations: [
    AppComponent,
    TopMenuComponent,
    EventsListComponent,
    NewEventComponent,
    EventFormComponent,
    LoginComponent,
    RegisterComponent,
    MyAccountComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    AngularFireModule.initializeApp(firebaseConfig),
    RouterModule.forRoot(routerConfig),
    ReactiveFormsModule,
  ],
  providers: [EventsService,AuthService,UserService],
  bootstrap: [AppComponent]
})
export class AppModule { }
