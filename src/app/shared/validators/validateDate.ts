import {FormControl} from "@angular/forms";


export function validateDate(ctrl:FormControl) {

    const value = ctrl.value;

    // const valid = /^(ftp|http|https):\/\/[^ "]+$/.test(urlValue);
    var moment = require('moment');
    const valid = moment(value, 'DD/MM/YYYY HH:mm', true).isValid();
    return valid ? null: {
        validDate: {
            valid: false
        }
    }


}
