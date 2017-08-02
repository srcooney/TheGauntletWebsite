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
        return new GauntletEvent(
            $key,
            title,
            description,
            imageURL,
            maxNumUsers,
            currNumUsers,
            new Date(eventStartTime),
            new Date(allAccessTime),
            eventCreator,
            eventCreatorKey
            );
    }

    }