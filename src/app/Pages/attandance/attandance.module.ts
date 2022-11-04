import { Routes, RouterModule } from '@angular/router';
import { SharedModule } from './../../Common/common.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { AttandancePage } from './attandance.page';
const routes: Routes = [{path:'',component:AttandancePage}];
@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SharedModule,
    RouterModule.forChild(routes)
  ],
  declarations: [AttandancePage]
})
export class AttandancePageModule {}
