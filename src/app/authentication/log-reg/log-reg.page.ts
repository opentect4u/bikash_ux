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
  customActionSheetOptions: any = {
    header: 'ARDB LIST',
  };
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
      pass:['',[Validators.required]],
      id:[0],
      lat:[''],
      long:['']
    });
  }
  setSignUpForm(){
    this.signUpForm = new FormGroup({
      user_id:new FormControl('',[Validators.required,Validators.pattern('^((\\+91-?)|0)?[0-9]{10}$')]),
      password:new FormControl('',[Validators.required,Validators.pattern('^^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{7,20}$')]),
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
    this.signUpForm.controls.user_id.valueChanges.subscribe(res =>{
      // console.log(res);
      this.signUpForm.patchValue({
        user: res
      });
    });
  }
  async signIn(){this.requestPermission();}
  async requestPermission(){
    /********************* Use After Integration of Api *************************/
    /***********For Mobile App************/
   const req = await this.loader.requestPermission();
     if(req === 'granted'){
      this.loader.showLoading('Logging In..');
      const options: PositionOptions = {
        enableHighAccuracy:true
      };
      this.location = await this.loader.getCurrentLocation(options);
      this.signInForm.patchValue({
      id:0,
      lat:this.location?.coords.latitude,
      long:this.location?.coords.longitude
      });
      setTimeout(() => {
        this.logIn();
      }, 2000);
    }
    else{
       this.loader.presentToast('you have not allowed location permission to this app yet!!','E');
    }
  /******End*******/

  /*********For Web *********/
  //  setTimeout(() => {
  //   this.logIn();
  //  }, 2000);
   /********End*************/
   /******************** End ************************* */
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
    this.loader.showLoading('Please Wait....');
    const dt ={
      user:this.signUpForm.value.user,
      user_id:this.signUpForm.value.user_id,
      email_id:this.signUpForm.value.email_id,
      password:this.signUpForm.value.password,
      user_name:this.signUpForm.value.user_name,
      ardb_id:this.signUpForm.value.ardb_id,
      vill_id:0,
      block_id:0,
      sa_id:0,
    };
  this.dbInct.callApi(1,'user_registration',dt).subscribe((res: any) =>{
   setTimeout(() => {
    this.loader.presentToast(res.suc > 0 ? 'Registration successfull, pending for approval!!' : res.msg,
      res.suc > 0 ? 'S' : 'E');
      this.loader.hideLoading();
      this.galleryType = res.suc > 0 ? 'L' : this.galleryType;
   }, 3000);
  },err => {
   setTimeout(() => {
    this.loader.hideLoading();
    this.loader.presentToast('Server not responding','E');
  }, 3000);
  });
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
  this.dbInct.callApi(1,'login',this.signInForm.value).subscribe((res: any)=>{
    if(res.suc > 0){
       this.loader.hideLoading();
       try{
       localStorage.setItem('location',JSON.stringify({lat:this.signInForm.value.lat,long:this.signInForm.value.long}));
       localStorage.setItem('ardb_name',this.ardbList.find((x: any) => x.ardb_code === Number(res.msg[0].ardb_id))?.ardb_name);
      localStorage.setItem('id',res.msg[0].rec_id);
      localStorage.setItem('ardb_id',res.msg[0].ardb_id);
      localStorage.setItem('block_id',res.msg[0].block_id);
      localStorage.setItem('sa_id',res.msg[0].sa_id);
      localStorage.setItem('vill_id',res.msg[0].vill_id);
      localStorage.setItem('name',res.msg[0].user_name);
      localStorage.setItem('user_id',res.msg[0].user_id);
      localStorage.setItem('email_id',res.msg[0].email_id);
      localStorage.setItem('user','true');
      localStorage.setItem('emp_code',res.msg[0].emp_code);
      this.loader.navigateToParicularPage('/main',null);
      }
    catch(ex){
      this.loader.hideLoading();
      this.loader.presentToast('Something wrong happened!!','E');
      localStorage.clear();
    }
    }
    else{
       this.loader.hideLoading();
       this.loader.presentToast(res.msg,'E');
    }
  },
  error =>{
    this.loader.hideLoading();
    this.loader.presentToast('Server not respond','E');
    localStorage.clear();
  });
 }


//Method called after user click on Send OTP

async checkReadSmsPermission(){

    this.loader.showLoading('Please Wait..');

    this.dbInct.callApi(0,'check_phone','user_id='+this.signUpForm.value.user_id).subscribe((res: any) =>{
     setTimeout(() => {
      if(res.suc > 0){
        this.loader.presentToast('mobile number already exist','E');
      }
      else{
         this.setStep(2);
         this.setTimer(2);
      }
      this.loader.hideLoading();
     }, 2000);

    },
    err =>{
     setTimeout(() => {
      this.loader.hideLoading();
      this.loader.presentToast('server not responding','E');
    }, 2000);
    });





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
  // console.log(this.timer);
  this.interval = setInterval(() =>{
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
   if(this.timer < 0){
    clearInterval(this.interval);
   }

 }
 getArdbList(){
  this.dbInct.callApi(0,'ardb_list','id=').pipe((map((x: any) => x.msg))).subscribe((res) =>{
    this.ardbList = res;
    console.log(this.ardbList);
  });
 }
}
