export class GauntletEvent {


    constructor(
        public $key:string,
        public title: string,
        public description: string,
        public longDescription: string
        ) {

    }

    static fromJsonList(array): GauntletEvent[] {
        return array.map(GauntletEvent.fromJson);
    }

    static fromJson({$key,title,description,longDescription}):GauntletEvent {
        return new GauntletEvent(
            $key,
            title,
            description,
            longDescription);
    }

    }