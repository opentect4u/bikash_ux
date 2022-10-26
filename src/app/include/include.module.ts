import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgOtpInputModule } from  'ng-otp-input';
import { IonicSelectableModule } from 'ionic-selectable';
@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    NgOtpInputModule,
    IonicSelectableModule
  ],
  exports:[
    ReactiveFormsModule,
    FormsModule,
    NgOtpInputModule,
    IonicSelectableModule
  ]
})
export class IncludeModule { }
