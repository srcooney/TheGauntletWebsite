import { Component, OnInit,Input,OnChanges,SimpleChanges } from '@angular/core';
import{EventsService} from '../shared/model/events.service';
@Component({
  selector: 'comment-list',
  templateUrl: './comment-list.component.html',
  styleUrls: ['./comment-list.component.css']
})
export class CommentListComponent implements OnInit,OnChanges {

	@Input()
  eventKey:string;
  @Input()
  displayName:string;

  comments: any;

  constructor(private eventsService: EventsService,) { }

  ngOnInit() {
  	
  }

  ngOnChanges(changes:SimpleChanges) {
  	if(this.eventKey != null){
  		this.eventsService.getCommentFromEventKey(this.eventKey)
  		.subscribe(comments => 
        {
          this.comments = comments;
        });
  	}
  }

  saveComment(input){
  	this.eventsService.saveComment(input.value,this.eventKey,this.displayName);
  	input.value = "";
  }

}
