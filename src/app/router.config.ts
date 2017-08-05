import {Route} from "@angular/router";
import {EventsListComponent} from "./events-list/events-list.component";
import {NewEventComponent} from "./new-event/new-event.component";
import {EditEventComponent} from "./edit-event/edit-event.component";
import {DuplicateEventComponent} from "./duplicate-event/duplicate-event.component";
import {MyAccountComponent} from "./my-account/my-account.component";
import {AdminComponent} from "./admin/admin.component";
import {CalendarComponent} from "./calendar/calendar.component";
import {AllEventsInfoComponent} from "./all-events-info/all-events-info.component";
import {EventDetailComponent} from "./event-detail/event-detail.component";
import {AuthGuard} from "./shared/security/auth.guard";

export const routerConfig : Route[] = [
	{
		path:'events',
		children: [
			{
				path: 'new',
				component: NewEventComponent

			},
			{
				path:'',
				component: EventsListComponent,

			}
		]
	},
	{
      path: 'event-detail/:id',
      component: EventDetailComponent
  },
  {
      path: 'edit/:id',
      component: EditEventComponent
  },
  {
      path: 'duplicate/:id',
      component: DuplicateEventComponent
  },
  {
      path: 'calendar',
      component: CalendarComponent
  },
  {
      path: 'all-events-info',
      component: AllEventsInfoComponent
  },
  {
      path: 'admin',
      component: AdminComponent,
      canActivate: [AuthGuard]
  },
	{
      path: 'my-account',
      component: MyAccountComponent
  },
	{
		path: '',
		redirectTo: 'events',
		pathMatch: 'full'
	},
	{
		path: '**',
		redirectTo: 'events'
	}
];