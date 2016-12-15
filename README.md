# TheGauntletWebsite

To visit the website please click on this link. https://the-gauntlet-datastore.firebaseapp.com

This project is a website built to handle event creation and user interaction with the created events. The website uses the angular2 framework with typescript for the front end and service handling. Firebase is used for the back end server and hosting.

This project uses the following technologies:
- generated with [angular-cli](https://github.com/angular/angular-cli) version 1.0.0-beta.20-4.
- moment.js to handle the date-time objects. (http://momentjs.com/)
- Angular 2 calendar plugin from this github project. (https://github.com/mattlewis92/angular-bootstrap-calendar) 
- AngularFire2 plugin to help with firebase backend handling. (https://github.com/angular/angularfire2)

## Code Structure

The code is organized into components and services and has been put in to directories by the angular cli tool.

The website has one main page that contains the top menu and footer. In between the top menu and the footer is the router outlet for displaying the different components.

There is an events service and user service which handles all of the firebase interaction so that all calls to the database are abstracted away from the components. There is also an authorization service which handles getting the authorized user and retreiving the application specific information about them.

## Layout and Pages

The website has a 6 main pages: My Account, Events, Event Details, Create/Modify Event, Calendar, Admin.

- My Account: Shows the events that the user is rsvp'd and waitlisted to.
- Events: Has a list of all events in chronological order.
- Event Details: Displays the event title, description, rsvp, waitlist, and comments. The event can also be edited, duplicated, or deleted.
- Create/Modify Event: Has a form that is empty if creating a new event, or prefilled with the events values if duplicating or editing the event.
- Calendar: Has a calendar that displays all the events that are happening. The calendar has a month, week, or day view. The page also has links to the Gauntlet Google+ page and Patreon page.
- Admin: Allows admins to set other users as admins, event creators, or patreon members.


