/*DEFAULT GENERATED TEMPLATE. DO NOT CHANGE SELECTOR TEMPLATE_URL AND CLASS NAME*/
import { Component, OnInit, Pipe, PipeTransform, ViewChild } from '@angular/core';
import { SystemService } from '../service/system.service';
import { Http, Response } from '@angular/http';
import { Headers, RequestOptions } from '@angular/http';
import { BSessionStorage } from '../service/bSessionStorage.service';
import { DatePipe } from '@angular/common';
import { MatTableDataSource } from '@angular/material';
import { Router } from '@angular/router';
import { getweekdaysService } from '../services/getWeekdays/getweekdays.service';
import { uniqueidService } from '../services/uniqueId/uniqueid.service';
/**
* Model import Example :
* import { HERO } from '../models/hero.model';
*/

/**
 * Service import Example :
 * import { HeroService } from '../services/hero/hero.service';
 */

@Component({
    selector: 'bh-managerdashboard',
    templateUrl: './managerdashboard.template.html'
})

export class managerdashboardComponent implements OnInit {
  @ViewChild('leaveForm') form;
  system = new SystemService();
  applyLeaveDetails = {};
  otherapplyLeaveDetails = {};
  leaveHistory = [];
  approveReject = [];
  employeeDetailsUrl;
  selectedTabIndex;
  getTotalCountdays;
  getRemainingCount;
  disableApplyBtn:any;
  showMessageBox: any;
  userToken:any;
  loginInfo:any;
  leaveType = ['casual leave', 'priviledged leave', 'special leave'];
  constructor(private http: Http, private bstorage: BSessionStorage, private router: Router, private weekdays: getweekdaysService, private uniqueid: uniqueidService) { }
  ngOnInit() {
    this.selectedTabIndex = 0;
    this.userToken = sessionStorage.getItem('accessToken');
    this.loginInfo = JSON.parse(sessionStorage.getItem('userObj'));
    this.employeeDetailsUrl = this.system.getDataModelUrl();
    this.getUserDetails();
  }
  ngAfterViewInit() {
    this.form.control.valueChanges.subscribe(values => {
      if (values['fromleavedate'] && values['toleavedate'] && values['selectedLeaveType']) {
        this.getweekdays();
      }
    });
  }
  logoutUser() {
    localStorage.clear();
    sessionStorage.clear();
    this.router.navigate(['/login']);
  }
  getUserDetails() {
    let headers = new Headers({
      'Authorization': 'Bearer ' + this.userToken,
      'Content-Type': 'application/json'
    });
    let options = new RequestOptions({ headers: headers });
    this.http.get(this.employeeDetailsUrl + 'userdetails?filter={"userkey": "' + this.loginInfo['username'] + '"}', options)
      .map(res => res.json())
      .subscribe(data => {
        console.log('response', data);
        this.applyLeaveDetails = data[0];
        this.applyLeaveDetails['manager'] = data[0]['manager']['username'];
      });
  }
  applyLeave(leaveForm) {
    var datePipe = new DatePipe("en-US");
    this.applyLeaveDetails['fromdateLeave'] = datePipe.transform(this.applyLeaveDetails['fromdateLeave'], 'yyyy/MM/dd');
    this.applyLeaveDetails['todateLeave'] = datePipe.transform(this.applyLeaveDetails['todateLeave'], 'yyyy/MM/dd');
    this.applyLeaveDetails['status'] = 'pending';
    this.applyLeaveDetails['uniqueId'] = this.uniqueid.guid();
    delete this.applyLeaveDetails['_id'];
    let headers = new Headers({
      'Authorization': 'Bearer ' + this.userToken,
      'Content-Type': 'application/json'
    });
    let options = new RequestOptions({ headers: headers });
    this.http.put(this.employeeDetailsUrl + 'appliedLeave', this.applyLeaveDetails, options)
      .map(res => res.json())
      .subscribe(data => {
        leaveForm.reset();
      	this.disableApplyBtn = false;
      	this.showMessageBox = false;
        console.log('response', data);
      });
    if (this.applyLeaveDetails['selectLeaveType'] == 'casual leave') {
      if (this.applyLeaveDetails['casualLeaveTaken']) {
        this.applyLeaveDetails['casualLeaveTaken'] = this.applyLeaveDetails['casualLeaveTaken'] + this.getTotalCountdays;
      } else {
        this.applyLeaveDetails['casualLeaveTaken'] = this.getTotalCountdays;
      }
    } else if (this.applyLeaveDetails['selectLeaveType'] == 'priviledged leave') {
      if (this.applyLeaveDetails['priviledgedLeaveTaken']) {
        this.applyLeaveDetails['priviledgedLeaveTaken'] = this.applyLeaveDetails['priviledgedLeaveTaken'] + this.getTotalCountdays;
      } else {
        this.applyLeaveDetails['priviledgedLeaveTaken'] = this.getTotalCountdays;
      }
    } else if (this.applyLeaveDetails['selectLeaveType'] == 'special leave') {
      if (this.applyLeaveDetails['specialLeaveTaken']) {
        this.applyLeaveDetails['specialLeaveTaken'] = this.applyLeaveDetails['specialLeaveTaken'] + this.getTotalCountdays;
      } else {
        this.applyLeaveDetails['specialLeaveTaken'] = this.getTotalCountdays;
      }
    }
    let modifydata = {
      "filter": { "userkey": this.loginInfo['username'] },
      "update": { 
        $set : {
        	"casualLeaveTaken": this.applyLeaveDetails['casualLeaveTaken'],
        	"priviledgedLeaveTaken": this.applyLeaveDetails['priviledgedLeaveTaken'],
        	"specialLeaveTaken": this.applyLeaveDetails['specialLeaveTaken']
        }
      },
      "options": {}
    }
    this.http.patch(this.employeeDetailsUrl + 'userdetails', modifydata, options)
      .map(res => res.json())
      .subscribe(data => {
        console.log('update response', data);
      });
  }
  getweekdays() {
    var datePipe = new DatePipe("en-US");
    this.getTotalCountdays = this.weekdays.workingDaysBetweenDates(
      datePipe.transform(this.applyLeaveDetails['fromdateLeave'], 'yyyy/MM/dd'),
      datePipe.transform(this.applyLeaveDetails['todateLeave'], 'yyyy/MM/dd')
    )
    this.showMessageBox = true;
    if (this.applyLeaveDetails['selectLeaveType'] == 'casual leave') {
      this.getRemainingCount = ( this.applyLeaveDetails['casualLeaveCount'] - this.applyLeaveDetails['casualLeaveTaken'] ) - this.getTotalCountdays;
      this.disableApplyBtn = ( this.applyLeaveDetails['casualLeaveCount'] - this.applyLeaveDetails['casualLeaveTaken'] )- this.getTotalCountdays > -1 ? true : false;
    } else if (this.applyLeaveDetails['selectLeaveType'] == 'priviledged leave') {
      this.getRemainingCount = ( this.applyLeaveDetails['priviledgedLeaveCount'] - this.applyLeaveDetails['priviledgedLeaveTaken'] ) - this.getTotalCountdays;
      this.disableApplyBtn = (this.applyLeaveDetails['priviledgedLeaveCount'] - this.applyLeaveDetails['priviledgedLeaveTaken']) - this.getTotalCountdays > -1 ? true : false;
    } else if (this.applyLeaveDetails['selectLeaveType'] == 'special leave') {
      this.getRemainingCount = (this.applyLeaveDetails['specialLeaveCount'] - this.applyLeaveDetails['specialLeaveTaken'] )- this.getTotalCountdays;
      this.disableApplyBtn = (this.applyLeaveDetails['specialLeaveCount'] - this.applyLeaveDetails['specialLeaveTaken'] ) - this.getTotalCountdays > -1 ? true : false;
    }

  }
  getTabChange(event) {
    if (event.index == '0' && event.tab['textLabel'] == 'Profile Details') {
      this.selectedTabIndex = 0;
      this.getUserDetails();
    } else if( event.index == '2' && event.tab['textLabel'] == 'Approve / Reject Leave') {
      this.selectedTabIndex = 2;
      this.getApproveReject();
    } else if (event.index == '4' && event.tab['textLabel'] == 'Leave History') {
      this.selectedTabIndex = 4;
      this.getLeaveHistory();
    } else {
      this.selectedTabIndex = 1;
    }
  }
  getLeaveHistory() {
    let headers = new Headers({
      'Authorization': 'Bearer ' + this.userToken,
      'Content-Type': 'application/json'
    });
    let options = new RequestOptions({ headers: headers });
    this.http.get(this.employeeDetailsUrl + 'appliedLeave?filter={"userkey": "' + this.loginInfo['username'] + '"}', options)
      .map(res => res.json())
      .subscribe(data => {
        this.leaveHistory = data;
        console.log('history', data);
      });
  }
  reloadData() {
    if (this.selectedTabIndex === 0) {
      this.getUserDetails();
    } else if (this.selectedTabIndex === 2) {
      this.getApproveReject();
    } else if(this.selectedTabIndex === 4) {
      this.getLeaveHistory();
    }
  }
  getApproveReject() {
    let headers = new Headers({
      'Authorization': 'Bearer ' + this.userToken,
      'Content-Type': 'application/json'
    });
    let options = new RequestOptions({ headers: headers });
    this.http.get(this.employeeDetailsUrl + 'appliedLeave?filter={"manager": "' + this.loginInfo['username'] + '", "status": "pending"}', options)
      .map(res => res.json())
      .subscribe(data => {
        this.approveReject = data;
        console.log('history', data);
    });
  }
  approveLeave(data) {
    console.log("id", data['_id']);
    if(data['approveLeaveComments']) {
      let modifydata = {
      "filter": { "uniqueId": data['uniqueId']},
      "update": { 
        $set : {
        	"status": 'Approved',
          	"comments": data['approveLeaveComments']
        }
      },
      "options": {}
    }
    let headers = new Headers({
      'Authorization': 'Bearer ' + this.userToken,
      'Content-Type': 'application/json'
    });
    let options = new RequestOptions({ headers: headers });
    this.http.patch(this.employeeDetailsUrl + 'appliedLeave', modifydata, options)
      .map(res => res.json())
      .subscribe(data => {
        console.log('update response', data);
      	this.getApproveReject();
      });
    }
  }
  rejectLeave(data) {
    
    /*let modifydata = {
      "filter": { "_id":  },
      "update": { 
        $set : {
        	"casualLeaveTaken": this.applyLeaveDetails['casualLeaveTaken'],
        	"priviledgedLeaveTaken": this.applyLeaveDetails['priviledgedLeaveTaken'],
        	"specialLeaveTaken": this.applyLeaveDetails['specialLeaveTaken']
        }
      },
      "options": {}
    }
    this.http.patch(this.employeeDetailsUrl + 'userdetails', modifydata, options)
      .map(res => res.json())
      .subscribe(data => {
        console.log('update response', data);
      });*/
  }
  
    
}
