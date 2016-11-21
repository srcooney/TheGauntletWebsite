export class User {


    constructor(
        public $key:string,
        public uid: string,
        ) {

    }

    static fromJsonList(array): User[] {
        return array.map(User.fromJson);
    }

    static fromJson({$key,uid}):User {
        return new User(
            $key,
            uid);
    }

    }