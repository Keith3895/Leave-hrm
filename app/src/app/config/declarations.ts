import { PageNotFoundComponent } from '../not-found.component';
import { LayoutComponent } from '../layout/layout.component';
import { TestComponent } from '../test/test.component';
import { NotificationService } from '../service/notification.service';
import { LocalStorageService } from '../service/local-storage.service';
import { ImgSrcDirective } from '../directives/imgSrc.directive';
import { BAuthGuard } from '../service/bAuthGuard.service';
import { BAppService } from '../service/bApp.service';
import { BLocalStorageService } from '../service/bLocalStorage.service';
import { BSessionStorage } from '../service/bSessionStorage.service';
import { BLoginService } from '../service/bLogin.service';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { BHttp } from '../service/bHTTP';
import { BHTTPLoader } from '../service/bHTTPLoader';
import { PubSubService } from '../service/pubSub.service';
import { AlertComponent } from '../alertComponent/alert.component';
import { BDataSourceService } from '../service/bDataSource.service';
import { bhiveMapComponent } from '../mapComponent/map.component';
import { APP_INITIALIZER } from '@angular/core';
import { BLogoutService } from '../service/bLogout.service';

//CORE_REFERENCE_IMPORTS
//CORE_REFERENCE_IMPORT-uniqueidService
import { uniqueidService } from '../services/uniqueId/uniqueid.service';
//CORE_REFERENCE_IMPORT-managerdashboardComponent
import { managerdashboardComponent } from '../managerdashboardComponent/managerdashboard.component';
//CORE_REFERENCE_IMPORT-getweekdaysService
import { getweekdaysService } from '../services/getWeekdays/getweekdays.service';
//CORE_REFERENCE_IMPORT-userdashboardComponent
import { userdashboardComponent } from '../userdashboardComponent/userdashboard.component';
//CORE_REFERENCE_IMPORT-loginComponent
import { loginComponent } from '../loginComponent/login.component';


export function startupServiceFactory(startupService: BLocalStorageService): Function {
  return () => startupService.initStorage();
}


/**
*bootstrap for @NgModule
*/
export const appBootstrap: any = [
  LayoutComponent,
];

/**
*Entry Components for @NgModule
*/
export const appEntryComponents: any = [
  AlertComponent
  //CORE_REFERENCE_PUSH_TO_ENTRY_ARRAY
];

/**
*declarations for @NgModule
*/
export const appDeclarations = [
  ImgSrcDirective,
  LayoutComponent,
  TestComponent,
  AlertComponent,
  //CORE_REFERENCE_PUSH_TO_DEC_ARRAY
//CORE_REFERENCE_PUSH_TO_DEC_ARRAY-managerdashboardComponent
managerdashboardComponent,
//CORE_REFERENCE_PUSH_TO_DEC_ARRAY-userdashboardComponent
userdashboardComponent,
//CORE_REFERENCE_PUSH_TO_DEC_ARRAY-loginComponent
loginComponent,
  PageNotFoundComponent,
  bhiveMapComponent
];

/**
* provider for @NgModuke
*/
export const appProviders = [
  {
    provide: HTTP_INTERCEPTORS,
    useClass: BHttp,
    multi: true
  },
  {
    // Provider for APP_INITIALIZER
    provide: APP_INITIALIZER,
    useFactory: startupServiceFactory,
    deps: [BLocalStorageService],
    multi: true
  },
  NotificationService,
  BAuthGuard,
  //CORE_REFERENCE_PUSH_TO_PRO_ARRAY
//CORE_REFERENCE_PUSH_TO_PRO_ARRAY-uniqueidService
uniqueidService,
//CORE_REFERENCE_PUSH_TO_PRO_ARRAY-getweekdaysService
getweekdaysService,
  LocalStorageService,
  PubSubService,
  BLoginService,
  BSessionStorage,
  BLocalStorageService,
  BAppService,
  BLogoutService,
  BHTTPLoader,
  BDataSourceService

];

/**
* Routes available for bApp
*/

// CORE_REFERENCE_PUSH_TO_ROUTE_ARRAY_START
export const appRoutes = [{path: 'login', component: loginComponent},{path: 'user', component: userdashboardComponent},{path: 'manager', component: managerdashboardComponent},{path: '', redirectTo: 'login', pathMatch: 'full'},{path: '**', component: PageNotFoundComponent}]
// CORE_REFERENCE_PUSH_TO_ROUTE_ARRAY_END
