import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';
import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HttpClientModule } from '@angular/common/http';
import { AndroidPermissions } from '@ionic-native/android-permissions/ngx';
import { BnNgIdleService } from 'bn-ng-idle';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { DatePipe } from '@angular/common';
import { SocketIoModule, SocketIoConfig } from 'ngx-socket-io';
import { environment } from 'src/environments/environment';
const config: SocketIoConfig = { url: `${environment.socketUrl}`, options: {transports: [ 'websocket' ], withCredentials: true}  };
@NgModule({
  declarations: [AppComponent],
  imports: [BrowserModule,
    IonicModule.forRoot(),
    HttpClientModule,
    SocketIoModule.forRoot(config),
    AppRoutingModule],
  providers: [
    DatePipe,
    BnNgIdleService,
    AndroidPermissions,
    SplashScreen,
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy }],
  bootstrap: [AppComponent],


})
export class AppModule {}
