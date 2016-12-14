export class GauntletEvent {


    constructor(
        public $key:string,
        public title: string,
        public description: string,
        public maxNumUsers: number,
        public currNumUsers: number,
        public eventStartTime: Date,
        public allAccessTime: Date,
        
        ) {

    }

    static fromJsonList(array): GauntletEvent[] {
        return array.map(GauntletEvent.fromJson);
    }

    static fromJson({$key,title,description,maxNumUsers,currNumUsers,eventStartTime,allAccessTime}):GauntletEvent {
        return new GauntletEvent(
            $key,
            title,
            description,
            maxNumUsers,
            currNumUsers,
            new Date(eventStartTime),
            new Date(allAccessTime)
            );
    }

    }