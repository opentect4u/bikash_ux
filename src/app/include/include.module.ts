import {NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgOtpInputModule } from  'ng-otp-input';
import { IonicSelectableModule } from 'ionic-selectable';
import { NgCalendarModule  } from 'ionic2-calendar';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    NgOtpInputModule,
    IonicSelectableModule,
    NgCalendarModule
  ],
  exports:[
    ReactiveFormsModule,
    FormsModule,
    NgOtpInputModule,
    IonicSelectableModule,
    NgCalendarModule
  ]
})
export class IncludeModule { }
