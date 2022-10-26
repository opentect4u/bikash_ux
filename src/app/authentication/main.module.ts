import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { MainAuthPage } from './main.page';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes=[
  {
    path:'',
    component:MainAuthPage,
    children:[
      {path:'',loadChildren:() =>import('./log-reg/log-reg.module').then(m=> m.LogRegPageModule)}
    ]
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [MainAuthPage]
})
export class MainPageModule {}
