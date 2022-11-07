/* eslint-disable arrow-body-style */
import { Injectable } from '@angular/core';
import { LoadingController, ToastController } from '@ionic/angular';
import { Geolocation } from '@capacitor/geolocation';
import { Router } from '@angular/router';
import { AndroidPermissions } from '@ionic-native/android-permissions/ngx';
import { SmsRetriever } from '@awesome-cordova-plugins/sms-retriever';

@Injectable({
  providedIn: 'root'
})
export class LoaderService {
  constructor(
    private androidPermissions: AndroidPermissions,
    private router: Router,
    public loadingController: LoadingController,
    public toastController: ToastController) { }

  async showLoading(msg) {
    const loading = await this.loadingController.create({
      message: msg,
      translucent: true,
      mode:'md'
    });
    return await loading.present();
  }
  async hideLoading() {
    this.loadingController.dismiss();
  }
  async presentToast(msg,type) {
    const toast = await this.toastController.create({
      message: msg,
      duration:5000,
      icon:type ===  'S' ? 'checkmark-outline' : 'alert-circle-outline',
      buttons: [
        {
          text:'',
          icon:'close-outline',
          role: 'cancel',
          handler: () => {}
        }]
    });
    toast.present();
  }
  async hideToastr(){
    this.toastController.dismiss();
  }

  async requestPermission(){
    const request = await Geolocation.requestPermissions();
    return request?.location;
  }
  async getCurrentLocation(options: PositionOptions): Promise<any>{
   return  await Geolocation.getCurrentPosition(options);
    // .then((res)=>{
    //   console.log(res);
    //   return {res};
    // },(err) =>{
    //   return {latitude:'',longitude:''};
    // });
  }

  navigateToParicularPage(url,urlParameter){
    if(urlParameter){

    }
    else{
      this.router.navigate([url]);
    }
  }

 async  getAndroidPermission(flag){
  let result;
  switch(flag){
    case 'P' : //Permission for phone
               break;
    case 'S' :result = await this.androidPermissions.requestPermission(this.androidPermissions.PERMISSION.RECEIVE_SMS);
              break;

  }
  return result;
  }
  async generateAppHash(): Promise<any>{
    let hashCode;
    SmsRetriever.getAppHash()
    .then((res: any) => {return hashCode = res;})
    .catch((error: any) => {return hashCode;});
  }
  async readMesage(): Promise<any>{
    let result;
       SmsRetriever.startWatching()
        .then((res: any) =>{
          result = res;
          return result;
        })
        .catch((error: any) => {return result;});
  }
}
