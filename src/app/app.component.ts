
/* eslint-disable @typescript-eslint/dot-notation */
import { Location } from '@angular/common';
import { Component,  OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController, Platform } from '@ionic/angular';
import { BnNgIdleService } from 'bn-ng-idle';
import { DbInteractionService } from './Service/db-interaction.service';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent implements OnInit {
  constructor(
    private location: Location,
    private platform: Platform,
    private controller: AlertController,
    private router: Router,
    private splashScreen: SplashScreen,
    private db: DbInteractionService,
    private bnIdle: BnNgIdleService) {
      this.initializeApp();}
    ngOnInit(): void {
      this.checkIdle();
      this.setHardwarebackbutton();
    }
  setHardwarebackbutton(){
   this.platform.backButton.subscribeWithPriority(10,()=>{
    if(this.router.url === '/'){
      this.showAlert();
    }
    else if(this.router.url === '/main/home'){
      navigator['app'].exitApp();
    }
    else{
      this.location.back();
    }
   });
  }
  async showAlert(){
   const alert = await this.controller.create({
     message:'Exit App?',
     mode:'ios',
     buttons:[{
          text:'Exit',
          handler:()=>{
            navigator['app'].exitApp();
          }
         },
         {
           text:'Cancel',
           role:'cancel'
         }
    ]
   });
    await alert.present();
  }
  checkIdle(){
    this.bnIdle.startWatching(3600).subscribe((isTimedOut: boolean) => {
      if (isTimedOut) {
        if(this.router.url!=='/'){
          this.db.loggedout();
          this.controller.dismiss();
        }
      }
    });
  }
  initializeApp(){
    this.platform.ready().then(() =>{
      this.splashScreen.hide();
    });
  }
}
