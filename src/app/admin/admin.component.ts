import { Component, OnInit } from '@angular/core';
import{UserService} from '../shared/model/user.service';
import{StatisticsService} from '../shared/model/statistics.service';
@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent implements OnInit {
  listView:string;

	adminUsers:any;
	nonAdminUsers:any;

  eventCreatorUsers:any;
  nonEventCreatorUsers:any;

  trueAttributeUsers:any;
  falseAttributeUsers:any;
  trueAttributeTitle:string;
  falseAttributeTitle:string;

  constructor(
    private statisticsService:StatisticsService,
  	private userService:UserService,) { }

  ngOnInit() {
    // this.trueAttributeUsers = [{displayName:"None"}];
    // this.falseAttributeUsers = [{displayName:"None"}];
    this.listView="admin";
    this.switchView(this.listView);


    // if (isChrome) alert("You are using Chrome!");
    // if (isSafari) alert("You are using Safari!");
  }

  updateAttributeStatus(userKey:string,attribute:string,status:boolean){
  	this.userService.updateAttributeStatus(userKey,attribute,status);
  }

  switchView(view:string){
    if(view == "stats")
      this.switchViewStats();
    else
      this.switchViewLists(view);
  }

  aveRsvps;
  switchViewStats(){
    this.listView = "stats";
    this.aveRsvps = this.statisticsService.getEventAveRsvps();
    console.log("switchViewStats")
    console.log(this.aveRsvps)
  }

  switchViewLists(view){
    this.userService.findAllUsersByAttribute(this.listView,true)
      .subscribe(trueAttributeUsers => 
        {
          this.trueAttributeUsers = trueAttributeUsers;
          if(trueAttributeUsers.length == 0){
            this.trueAttributeUsers = [{displayName:"None"}];}
        }).unsubscribe();

    this.userService.findAllUsersByAttribute(this.listView,false)
      .subscribe(falseAttributeUsers => 
        {
          this.falseAttributeUsers = falseAttributeUsers;
          if(falseAttributeUsers.length == 0) {
            this.falseAttributeUsers = [{displayName:"None"}];}
   
        }).unsubscribe();
      
    this.listView = view;
    if(this.listView == "admin"){
      this.trueAttributeTitle="Admins";
      this.falseAttributeTitle="Non Admins"
    }
    else if(this.listView == "eventCreator"){
      this.trueAttributeTitle="Event Creators";
      this.falseAttributeTitle="Non Event Creators"
    }
    else if(this.listView == "patreon7Member"){
      this.trueAttributeTitle="Patreon 7$ Members";
      this.falseAttributeTitle="Non Patreon 7$ Members"
    }

    this.userService.findAllUsersByAttribute(this.listView,true)
      .subscribe(trueAttributeUsers => 
        {
          this.trueAttributeUsers = trueAttributeUsers;
          if(trueAttributeUsers.length == 0){
            this.trueAttributeUsers = [{displayName:"None"}];}
        });

    this.userService.findAllUsersByAttribute(this.listView,false)
      .subscribe(falseAttributeUsers => 
        {
          this.falseAttributeUsers = falseAttributeUsers;
          if(falseAttributeUsers.length == 0){
            this.falseAttributeUsers = [{displayName:"None"}];}
        });
  }

}
