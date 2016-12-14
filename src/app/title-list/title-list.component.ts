import { Component, OnInit,Input } from '@angular/core';
import {Router} from "@angular/router";
@Component({
  selector: 'title-list',
  templateUrl: './title-list.component.html',
  styleUrls: ['./title-list.component.css']
})
export class TitleListComponent implements OnInit {

	@Input()
	componentTitle:any;
	@Input()
	titleList:any;
  @Input()
  routeList:any;
  constructor(private router:Router,) { }

  ngOnInit() {
    if(this.titleList == undefined){
      this.titleList = ["None"];
    }
  }

  route(i){
    if(this.routeList != undefined) {
      this.router.navigate([this.routeList[i]]);
    };
  }

}
