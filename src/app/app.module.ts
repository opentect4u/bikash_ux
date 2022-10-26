import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';
import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HttpClientModule } from '@angular/common/http';
import { AndroidPermissions } from '@ionic-native/android-permissions/ngx';
import { Uid } from '@ionic-native/uid/ngx';
import { BnNgIdleService } from 'bn-ng-idle';

@NgModule({
  declarations: [AppComponent],
  imports: [BrowserModule,
    IonicModule.forRoot(),
    HttpClientModule,
    AppRoutingModule],
  providers: [BnNgIdleService,Uid,AndroidPermissions,{ provide: RouteReuseStrategy, useClass: IonicRouteStrategy }],
  bootstrap: [AppComponent],

})
export class AppModule {}
