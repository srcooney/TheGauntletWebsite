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
import {EmailService} from './shared/model/email.service';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/do';
import { NewEventComponent } from './new-event/new-event.component';
import { EventFormComponent } from './event-form/event-form.component';
import { ReactiveFormsModule } from '@angular/forms';
import {AuthService} from "./shared/security/auth.service";
import { MyAccountComponent } from './my-account/my-account.component';
import { EventDetailComponent } from './event-detail/event-detail.component';
import { RsvpButtonComponent } from './rsvp-button/rsvp-button.component';
import { TitleListComponent } from './title-list/title-list.component';
import { CommentListComponent } from './comment-list/comment-list.component';
import { AdminComponent } from './admin/admin.component';
import { CalendarComponent } from './calendar/calendar.component';
import { CalendarModule as CalendarEvents } from 'angular-calendar';
import { EditEventComponent } from './edit-event/edit-event.component';
import { DuplicateEventComponent } from './duplicate-event/duplicate-event.component';
import { Calendar2Component } from './calendar2/calendar2.component';
import { FooterComponent } from './footer/footer.component';
import {AuthGuard} from "./shared/security/auth.guard";
import { NKDatetimeModule } from 'ng2-datetime/ng2-datetime';
// import { moment-picker } from 'angular-moment-picker';
// import * as angular from '@angular';
// var myApp = angular.module('myApp', ['moment-picker']);
import {CalendarModule as CalendarDateTime} from 'primeng/primeng';
@NgModule({
  declarations: [
    AppComponent,
    TopMenuComponent,
    EventsListComponent,
    NewEventComponent,
    EventFormComponent,
    MyAccountComponent,
    EventDetailComponent,
    RsvpButtonComponent,
    TitleListComponent,
    CommentListComponent,
    AdminComponent,
    CalendarComponent,
    EditEventComponent,
    DuplicateEventComponent,
    Calendar2Component,
    FooterComponent,

  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    AngularFireModule.initializeApp(firebaseConfig),
    RouterModule.forRoot(routerConfig),
    ReactiveFormsModule,
    CalendarEvents.forRoot(),
    NKDatetimeModule,
    CalendarDateTime
    // 'moment-picker'
  ],
  providers: [EventsService,AuthService,UserService,AuthGuard,EmailService],
  bootstrap: [AppComponent]
})
export class AppModule { }
