import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { GeneratedListPage } from './generated-list.page';
import { Routes, RouterModule } from '@angular/router';
import { SharedModule } from '../../Common/common.module';
const routes: Routes=[{path:'',component:GeneratedListPage}];
@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes),
    SharedModule
  ],
  declarations: [GeneratedListPage]
})
export class GeneratedListPageModule {}
