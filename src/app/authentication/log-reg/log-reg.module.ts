import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { LogRegPage } from './log-reg.page';
import { Routes, RouterModule } from '@angular/router';
import { SharedModule } from 'src/app/Common/common.module';

const route: Routes=[{path:'',component:LogRegPage}];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(route),
    SharedModule
  ],
  declarations: [LogRegPage]
})
export class LogRegPageModule {}
