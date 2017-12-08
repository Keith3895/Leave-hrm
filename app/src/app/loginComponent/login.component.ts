/*DEFAULT GENERATED TEMPLATE. DO NOT CHANGE SELECTOR TEMPLATE_URL AND CLASS NAME*/
import { Component, OnInit } from '@angular/core'
import { FormControl, Validators } from '@angular/forms';
import { SystemService } from '../service/system.service'
import { Http, Response } from '@angular/http';
import { Headers, RequestOptions } from '@angular/http';
import { BSessionStorage } from '../service/bSessionStorage.service'
import { Router } from '@angular/router';
import { BLoginService } from '../service/bLogin.service';

/**
* Model import Example :
* import { HERO } from '../models/hero.model';
*/

/**
 * Service import Example :
 * import { HeroService } from '../services/hero/hero.service';
 */

@Component({
    selector: 'bh-login',
    templateUrl: './login.template.html'
})

export class loginComponent implements OnInit {
    system = new SystemService();
    loginDetails = {};
    constructor(private http: Http, private bstorage: BSessionStorage, private router: Router, private bLoginService: BLoginService ) {}
    ngOnInit() {
    }
  	submitLogin() {
      let jsonData;
      this.bLoginService.login(this.loginDetails['username'], this.loginDetails['password'] ).subscribe(result => {
         jsonData = JSON.parse(sessionStorage.getItem('userObj');
         if(jsonData['groupList'][0] == 'USER_EMPLOYEE') {
           this.router.navigate(['/user']);
         } else if(jsonData['groupList'][0] == 'USER_MANAGER') {
           this.router.navigate(['/manager']);
         } else if(jsonData['groupList'][0] == 'USER_HR') {
           this.router.navigate(['/admin']);
         }
      })
    }

}
