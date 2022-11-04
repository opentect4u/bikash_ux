import { SharedModule } from 'src/app/Common/common.module';
import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { NotesPage } from './notes.page';
const routes: Routes = [
  {path: '',component: NotesPage}
];
@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes),
    SharedModule
  ],
  declarations: [NotesPage]
})
export class NotesPageModule {}
