/* eslint-disable @typescript-eslint/dot-notation */
import { Location } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController, Platform } from '@ionic/angular';
import { BnNgIdleService } from 'bn-ng-idle';
import { LoaderService } from './Service/loader.service';



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
    private bnIdle: BnNgIdleService,
    private load: LoaderService) {

      platform.ready().then(() => {
      //  console.log(this.platform);
      });
    }
  ngOnInit(): void {
    this.checkIdle();
    this.setHardwarebackbutton();
    // this.killApp();
}
  setHardwarebackbutton(){
   this.platform.backButton.subscribeWithPriority(10,()=>{
    if(this.router.url === '/'){
      //Alert
      this.showAlert();
    }
    else if(this.router.url === '/main/home'){
      navigator['app'].exitApp();
    }
    else{
      //Simply navigate to back..
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
    this.bnIdle.startWatching(300).subscribe((isTimedOut: boolean) => {
      if (isTimedOut) {
        if(this.router.url!=='/'){
          localStorage.clear();
          this.load.navigateToParicularPage('/',null);
        }
      }
    });
  }
  // killApp(){
  //   this.platform.pause.subscribe(() => {
  //      localStorage.clear();
  //   });
  // }
}
