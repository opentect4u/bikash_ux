import { NgModule, Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { HelpPage } from './help.page';
import { Routes, RouterModule } from '@angular/router';
import { SharedModule } from 'src/app/Common/common.module';

const routes: Routes=[{path:'',component:HelpPage}];
@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes),
    SharedModule
  ],
  declarations: [HelpPage]
})
export class HelpPageModule {}
