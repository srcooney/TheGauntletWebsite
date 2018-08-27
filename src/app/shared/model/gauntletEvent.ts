export class GauntletEvent {


    constructor(
        public $key:string,
        public title: string,
        public description: string,
        public imageURL: string,
        public maxNumUsers: number,
        public currNumUsers: number,
        public eventStartTime: Date,
        public allAccessTime: Date,
        public eventCreator: string,
        public eventCreatorKey: string,
        ) {

    }

    static fromJsonList(array): GauntletEvent[] {
        return array.map(GauntletEvent.fromJson);
    }

    static fromJson({$key,title,description,imageURL,maxNumUsers,currNumUsers,eventStartTime,allAccessTime,eventCreator,eventCreatorKey}):GauntletEvent {
        var moment = require('moment');
        var forcedAllAccessTime = moment.utc("2018-09-03T12:00:00-05:00").format('MM/DD/YYYY HH:mm').toString();

        return new GauntletEvent(
            $key,
            title,
            description,
            imageURL,
            maxNumUsers,
            currNumUsers,
            new Date(eventStartTime),
            new Date(forcedAllAccessTime),
            eventCreator,
            eventCreatorKey
            );
    }

    }