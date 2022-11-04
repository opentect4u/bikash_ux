/* eslint-disable @typescript-eslint/naming-convention */
import { LoaderService } from './../../Service/loader.service';
import { DbInteractionService } from 'src/app/Service/db-interaction.service';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { UtilityCheckPassword } from 'src/app/Utility/utilityPassword';
import { ImagePicker, ImagePickerOptions } from '@awesome-cordova-plugins/image-picker/ngx';
import { Camera, CameraOptions } from '@ionic-native/Camera/ngx';
import { ActionSheetController } from '@ionic/angular';
@Component({
  selector: 'app-modify-profile',
  templateUrl: './modify-profile.page.html',
  styleUrls: ['./modify-profile.page.scss'],
})
export class ModifyProfilePage implements OnInit {
  showImage: any;
  galleryType: any = 'L';
  profile: FormGroup;
  password: FormGroup;
  constructor(
    private actionSheetController: ActionSheetController,
    private camera: Camera,
    private imagePicker: ImagePicker,
    private db: DbInteractionService,
    private loader: LoaderService) {
      this.setProfileForm();
      this.setPasswordForm();
    }
  ionViewWillEnter(){
   this.setProfileFormValue(
    localStorage.getItem('name'),
    localStorage.getItem('email_id'));
  }
  ngOnInit() {}

  setProfileForm(){
   this.profile = new FormGroup({
    user_name:new FormControl('',[Validators.required,Validators.minLength(4)]),
    email_id:new FormControl('',[Validators.email])
   });
  }
  setProfileFormValue(u_name,e_id){
    this.profile.patchValue({
      user_name:u_name,
      email_id:e_id
    });
  }
  setPasswordForm(){
  this.password =new FormGroup({
    old_pass:new FormControl('',[Validators.required]),
    new_pass:new FormControl('',[Validators.required,Validators.pattern('^^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{7,20}$')]),
    conf_pass:new FormControl('',[Validators.required])
  },
  UtilityCheckPassword.mustMatch('new_pass', 'conf_pass'));
  }
  reset(event){
    this.galleryType = event;
    // this.profile.reset();
    this.password.reset();
  }
  submitPassword(type){
    const api_name = type === 'P' ? 'change_pass' : 'user_update';
    let dt;
    this.loader.showLoading('Please Wait...');

    switch(type){
      case 'P':dt = {
                  password:this.password.value.new_pass,
                  old_pass:this.password.value.old_pass,
                  user_id:localStorage.getItem('user_id'),
                  user:localStorage.getItem('user_id')
                };
                this.changeProfileOrPassword(dt,api_name,type);
                break;
      case 'A':
               dt ={
                user_name:this.profile.value.user_name,
                email_id:this.profile.value.email_id,
                user:localStorage.getItem('user_id'),
                user_id:localStorage.getItem('user_id')
               };
              this.changeProfileOrPassword(dt,api_name,type);
               break;
      default:break;
    }
  }
  changeProfileOrPassword(dt,api_name,type){
   this.db.callApi(1,api_name,dt).subscribe((res: any) =>{
    setTimeout(() => {
      this.loader.hideLoading();
      this.loader.presentToast(res.msg,res.suc > 0 ? 'S' : 'E');
      if(type === 'A'){
        localStorage.setItem('name',this.profile.value.user_name);
        localStorage.setItem('email_id',this.profile.value.email_id);
      }
      else{
        this.password.reset();
      }
    }, 1000);

   },
   err =>{
    setTimeout(() => {
      this.loader.hideLoading();
      this.loader.presentToast('Server not responding','E');
    }, 1000);
   });

  }

  async chooseImage(){
    const actionSheet = await this.actionSheetController.create({
      header: 'Select Image source',
      mode:'ios',
      buttons: [{
        text: 'Load from Library',
        handler: () => {
          this.chooseFromImage();
        }
      },
      {
        text: 'Use Camera',
        handler: () => {
          this.choosCamera(this.camera.PictureSourceType.CAMERA);
        }
      },
      {
        text: 'Cancel',
        role: 'cancel'
      }
      ]
    });
    await actionSheet.present();
  }

  //choose From Camera
  async choosCamera(_sourceType) {
    const options: CameraOptions = {
      quality:100,
      mediaType:this.camera.MediaType.PICTURE,
      destinationType:this.camera.DestinationType.DATA_URL,
      encodingType:this.camera.EncodingType.JPEG,
      sourceType:_sourceType
    };
   this.camera.getPicture(options).then(async (result) =>{
        console.log(result);
        const base64Response = await fetch(`data:image/jpeg;base64,${result}`);
        const blob = await  base64Response.blob();
        this.showImage = `data:image/jpeg;base64,${result}`;
        this.postImage(blob);
   },
   error=>{
     console.log(error);
   });
  }
  async chooseFromImage(){
    const options: ImagePickerOptions = {
      quality: 50,
      maximumImagesCount:1,
      outputType:1
    };
    this.imagePicker.getPictures(options).then(async (imageresult) =>{
      console.log(imageresult);
      if(imageresult.length > 0){
        const base64Response = await fetch(`data:image/jpeg;base64,${imageresult[0]}`);
        const blob = await base64Response.blob();
        this.showImage = `data:image/jpeg;base64,${imageresult[0]}`;
        this.postImage(blob);
      }
    },
    error=>{
      // console.log(error);
    });
  }

  postImage(b_file){
  //  const fb = new FormData();
  //  fb.append('file',b_file,(new Date().getTime()).toString(16)+'.jpeg');
  //  fb.append('user_id',localStorage.getItem('user_id'));
  //  fb.append('user',localStorage.getItem('user_id'));
  //  this.db.callApi(1,'save_pro_pic',fb).subscribe(res =>{
  //   console.log(res);
  //  });
  }
}
