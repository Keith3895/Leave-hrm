/*DEFAULT GENERATED TEMPLATE. DO NOT CHANGE CLASS NAME*/
import { Injectable } from '@angular/core';

@Injectable()
export class uniqueidService {
	guid() {
     function s4() {
        return Math.floor((1 + Math.random()) * 0x10000)
        .toString(16)
        .substring(1);
     }
     return new Date().getUTCMilliseconds() + s4() + s4() + '-' + s4() + '-' + s4() + '-' +
     s4() + '-' + s4();
   	}
}
