import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { LogRegPage } from './log-reg.page';
import { Routes, RouterModule } from '@angular/router';
import { IncludeModule } from 'src/app/include/include.module';
import { SharedModule } from 'src/app/Common/common.module';
import { Uid } from '@ionic-native/uid/ngx';

const route: Routes=[{path:'',component:LogRegPage}];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(route),
    SharedModule
  ],
  providers:[Uid],
  declarations: [LogRegPage]
})
export class LogRegPageModule {}
