
import {User} from "../model/user";

export class AuthInfo {

    constructor(
        public $user:User
    ) {

    }

    isLoggedIn() {
        return !!this.$user;
    }

    isAdmin(){
    	if(this.$user){return this.$user.admin;}
    	else{return false;}
    }

    isEventCreator(){
    	if(this.$user){return this.$user.eventCreator;}
    	else{return false;}
    }

    isRegistered(){
    	if(this.$user){return this.$user.registered;}
    	else{return false;}
    }

    public get displayName() : string {
    	return this.$user.displayName;
    }

    public get key() : string {
    	return this.$user.$key;
    }

}
