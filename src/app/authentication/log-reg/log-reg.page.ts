/* eslint-disable @typescript-eslint/naming-convention */
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { LoaderService } from 'src/app/Service/loader.service';
import { UtilityM } from 'src/app/Utility/utilityEvent';
import { UtilityCheckPassword } from 'src/app/Utility/utilityPassword';
import {PositionOptions } from '@capacitor/geolocation';
import { SmsRetriever } from '@awesome-cordova-plugins/sms-retriever';
import { DbInteractionService } from 'src/app/Service/db-interaction.service';
import { BehaviorSubject } from 'rxjs';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-log-reg',
  templateUrl: './log-reg.page.html',
  styleUrls: ['./log-reg.page.scss'],
})
export class LogRegPage{
  @ViewChild('ngOtpInput', { static: false}) ngOtpInput: any;
  time: BehaviorSubject<string> = new BehaviorSubject<string>('02:00');
  timer = 0;
  interval;
  ardbList: any=[];
  location: any;
  galleryType = 'L';
  isText=false;
  isPass = false;
  isConfPass = false;
  step = 1;
  curOTP: any;
  hashCd: any = '';
  signInForm: FormGroup;
  signUpForm: FormGroup;
  constructor(
    private dbInct: DbInteractionService,
    private fb: FormBuilder,
    private loader: LoaderService) {
    this.setSignUpForm();
    this.setSignInForm();
    this.getArdbList();
  }

  ionViewWillEnter(){}
  preventNonNumeric(event){UtilityM.preventNonNumeric(event);}
  setSignInForm(){
    this.signInForm = this.fb.group({
      // eslint-disable-next-line @typescript-eslint/naming-convention
      user_id:['',[Validators.required,Validators.pattern('^((\\+91-?)|0)?[0-9]{10}$')]],
      pass:['',Validators.required],
      id:[0],
      lat:[''],
      long:['']
    });
  }
  setSignUpForm(){
    this.signUpForm = new FormGroup({
      user_id:new FormControl('',[Validators.required,Validators.pattern('^((\\+91-?)|0)?[0-9]{10}$')]),
      password:new FormControl('',Validators.required),
      email_id:new FormControl('',[Validators.email]),
      ardb_id:new FormControl('',[Validators.required]),
      user_name:new FormControl('',[Validators.required,Validators.minLength(4)]),
      otp:new FormControl('',[Validators.required,Validators.minLength(4)]),
      confpassword:new FormControl('',Validators.required),
      vill_id:new FormControl('0'),
      sa_id:new FormControl('0'),
      block_id:new FormControl('0'),
      user:new FormControl('')
    },
    UtilityCheckPassword.mustMatch('password', 'confpassword'));
  }
  async signIn(){
   this.requestPermission();
  }
  async requestPermission(){
    /********************* Use After Integration of Api*************************/
  //  const req = await this.loader.requestPermission();
  //    if(req === 'granted'){
  //          const options: PositionOptions = {
  //            enableHighAccuracy:true
  //          };
  //   this.location = await this.loader.getCurrentLocation(options);
  //   this.signInForm.patchValue({
  //     lat:this.location.coords.latitude,
  //     long:this.location.coords.longitude
  //   });
  //  }
  //   this.logIn();
   /******************** End ************************* */

   /******************** Use For Demo ************************* */
 this.loader.showLoading('Logging In..');
 setTimeout(() => {
  this.loader.hideLoading();
  localStorage.setItem('user','true');
  localStorage.setItem('ardb_id','26');
  this.loader.navigateToParicularPage('/main',null);
  }, 3000);
  /********************** End ********************************* */
  }

  signUp(){
   switch(this.step){
    case 1:this.sentOTP();break;
    case 2:this.verifyOTP();break;
    case 3:this.signUpComplete();break;
    default:break;
   }
  }
  async sentOTP(){
    this.checkReadSmsPermission();
  }
  verifyOTP(){
  this.setStep(3);
  clearInterval(this.interval);
    /*********API Integrations********* */
    //check If OTP is correct or not
    // this.loader.showLoading('Verifying OTP...');
    // if(this.curOTP === this.ngOtpInput.currentVal){
    //   this.setOtp(3);
    // }
    // this.loader.hideLoading();
    /*********END********* */

  }
  signUpComplete(){
    console.log(this.signUpForm.value);
  //  this.loader.presentToast('Registration Successfull','S');
  // this.dbInct.callApi(1,'Registration',this.signUpForm.value).subscribe(res =>{
  //   console.log(res);
  // });
   //Submit the details
 }
 reset(event){
  this.galleryType = event;
  this.setStep(1);
  this.signUpForm.reset();
  this.signInForm.reset();
  clearInterval(this.interval);
 }

 otpChange(ev){
  this.setOtp(ev);
 }
 setOtp(val){
  this.signUpForm.patchValue({
    otp:val
  });
 }
 //For Sign In Method
 logIn(){
  console.log(this.signInForm.value);
  this.dbInct.callApi(1,'/login',this.signInForm.value).subscribe((res: any)=>{
    // if(res > 0){
    //   localStorage.setItem('user',JSON.stringify(res.msg[0]));
    //   localStorage.setItem('location',JSON.stringify({lat:this.signInForm.value.lat,long:this.signInForm.value.long}));
    //   this.loader.navigateToParicularPage('/main',null);
    // }
    // else{
    //   this.loader.presentToast(res.msg,'E');
    // }
    console.log(res);
  });
 }


//Method called after user click on Send OTP

async checkReadSmsPermission(){
    this.signUpForm.patchValue({
      user:this.signUpForm.value.user_id
    });
    this.setStep(2);
    this.setTimer(2);
  /**********Demo************ */
  // const result = await this.loader.getAndroidPermission('S');
  // console.log(result);
  // if(result.hasPermission){
  //   this.setStep(2);
  //   SmsRetriever.getAppHash()
  //   .then((res: any) => {console.log(res);})
  //   .catch((error: any) => {console.log(error);});
  //   SmsRetriever.startWatching()
  //   .then((res: any) =>{
  //     const msg = res;
  //      if(msg){
  //   this.loader.showLoading('Verifying OTP...');
  //     this.ngOtpInput.setValue(msg.slice(0,4));
  //     this.setOtp(this.ngOtpInput.currentVal);

  //     }
        // setTimeout(() =>{
        //     this.loader.hideLoading();
        //     this.setStep(3);
        // },1000)
  //   })
  //   .catch((error: any) => {console.log(error);
  //     this.loader.hideLoading();
  //     this.loader.presentToast('Something Wrong Happened! Please Click on Resend OTP','E');
  //   });
  // }
  /***********END*************** */

  /****************Use After Api Integrations***************** */
  // this.senSMS(result.hasPermission);
  /********END*** */

 }
  /****************Use After Api Integrations***************** */
//  async senSMS(permission){
//    if(permission){
//      this.hashCd = await this.loader.generateAppHash();
//    }
//   const dt ={
//     phone:this.signUpForm.value.phone,
//     hash:this.hashCd ? this.hashCd : ''
//   };
//    this.dbInct.callApi(1,'/sendOTP',dt).subscribe(async (res: any) =>{
//       this.curOTP = res.msg;
//       if(permission){
//
//         const msg = await this.loader.readMesage();
//         console.log(msg);

//         if(msg){
//           this.loader.showLoading('Verifying OTP...');
//           this.ngOtpInput.setValue(msg.slice(0,6));
//           this.setOtp(this.ngOtpInput.currentVal);
//           this.loader.hideLoading();
//           ClearInterval();
//          this.setStep(3);
//         }


//       }
//    });
//  }
/********END*** */

 setStep(num){
    this.step = num;
 }

 setTimer(duration: number){
   clearInterval(this.interval);
  this.timer = duration * 60 ;
  console.log(this.timer);
  this.interval = setInterval(() =>{
    console.log('s');
    this.updateTimerValue();
  },1000);
 }
 updateTimerValue(){
   let minutes: any = this.timer / 60;
   let seconds: any = this.timer % 60;

   minutes = String('0' + Math.floor(minutes)).slice(-2);
   seconds = String('0' + Math.floor(seconds)).slice(-2);

   const text = minutes + ':' + seconds;
   this.time.next(text);
   --this.timer;
   console.log(this.timer);
   if(this.timer < 0){
    clearInterval(this.interval);
   }

 }
 getArdbList(){
  this.dbInct.callApi(0,'ardb_list','id=').pipe((map((x: any) => x.msg))).subscribe((res) =>{
    console.log(res);
    this.ardbList = res;
  });
 }
}
