import { SharedModule } from './../../Common/common.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { ModifyProfilePage } from './modify-profile.page';
import { RouterModule, Routes } from '@angular/router';
import {ImagePicker} from '@awesome-cordova-plugins/image-picker/ngx';
import { Camera } from '@ionic-native/Camera/ngx';
const routes: Routes = [
  {
    path: '',
    component: ModifyProfilePage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SharedModule,
    RouterModule.forChild(routes)
  ],
  declarations: [ModifyProfilePage],
  providers:[ImagePicker,Camera],
  exports:[RouterModule]
})
export class ModifyProfilePageModule {}
