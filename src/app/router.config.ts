import {Route} from "@angular/router";
import {EventsListComponent} from "./events-list/events-list.component";
import {NewEventComponent} from "./new-event/new-event.component";
import {LoginComponent} from "./login/login.component";
import {MyAccountComponent} from "./my-account/my-account.component";
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
      path: 'my-account',
      component: MyAccountComponent
  },
	{
      path: 'login',
      component: LoginComponent
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