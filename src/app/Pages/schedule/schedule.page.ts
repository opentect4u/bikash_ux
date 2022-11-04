import { DatePipe } from '@angular/common';
import { LoaderService } from './../../Service/loader.service';
/* eslint-disable @typescript-eslint/naming-convention */
import { DbInteractionService } from './../../Service/db-interaction.service';

import { Component, OnInit, ViewChild } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { CalendarComponent } from 'ionic2-calendar';
import { CalendarMode } from 'ionic2-calendar/calendar';
import { ModalComponent } from 'src/app/Common/modal/modal.component';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-schedule',
  templateUrl: './schedule.page.html',
  styleUrls: ['./schedule.page.scss']
})
export class SchedulePage implements OnInit {
  @ViewChild(CalendarComponent) myCal: CalendarComponent;
  eventSource = [];
  viewTitle: string;
  calendar = {
    mode: 'month' as CalendarMode,
    currentDate: new Date(),
  };
  selectedDate: Date;
  constructor(
    private datePipe: DatePipe,
    public loader: LoaderService,
    private dbIntr: DbInteractionService,
    private modalCtrl: ModalController
  ) {
  }

  ngOnInit() {
    this.setList('');
  }
    // Change current month/week/day
    next() {this.myCal.slideNext();}
    back() {this.myCal.slidePrev();}
    onViewTitleChanged(title) {this.viewTitle = title;}
    setList(_id){
      this.dbIntr.callApi(0,'tour_prog','id='+_id+'&user_id='+localStorage.getItem('user_id')).
      pipe((map((x: any) => x.msg))).subscribe(res =>{
            console.log(res);
            res.forEach(element => {
              this.eventSource.push({
                title:element.prog_title,
                desc:element.prog_desc,
                sl_no: element.sl_no,
                startTime:new Date(element.frm_dt),
                endTime:new Date(element.to_dt),
                allDay: true
              });
            });
            this.myCal.loadEvents();
      });
    }

  // Calendar event was clicked
  async onEventSelected(event) {
    this.setDataToModal({
      title:event.title,
      startTime:new Date(event.startTime).toISOString(),
      endTime:new Date(event.endTime).toISOString(),
      desc:event.desc,
      sl_no: event.sl_no
    });
  }

  async openCalModal(ev) {
   this.setDataToModal({
    title:'',
    startTime:new Date().toISOString(),
    endTime:new Date().toISOString(),
    desc:'',
    sl_no:0});
  }
  async setDataToModal(_event){
    const modal = await this.modalCtrl.create({
      component: ModalComponent,
      cssClass: 'cal-modal',
      backdropDismiss: false,
      componentProps:{
        event:_event,
        mode:{name:this.viewTitle}}
    });
    await modal.present();
    modal.onDidDismiss().then((result) => {
      console.log(result?.data);
      if(result?.data){
           this.submitEvent(result?.data.event);
      }

    });
  }
  submitEvent(data){
    const dt ={
      user_id:localStorage.getItem('user_id'),
      user:localStorage.getItem('name'),
      frm_dt:this.datePipe.transform(data.startTime,'YYYY-MM-dd'),
      to_dt:this.datePipe.transform(data.endTime,'YYYY-MM-dd'),
      prog_title:data.title,
      prog_desc:data.desc,
      sl_no:data.sl_no,
      ardb_id:localStorage.getItem('ardb_id')
    };
    this.dbIntr.callApi(1,'tour_prog',dt).subscribe((res: any) =>{
      if(res.suc > 0){
        if(data.sl_no > 0){
          const findIndex = this.eventSource.findIndex((x: any) => x.sl_no === data.sl_no);
          this.eventSource[findIndex] = {
            title:data.title,
            desc:data.desc,
            sl_no: data.sl_no,
            startTime:new Date(data.startTime),
            endTime:new Date(data.endTime),
            allDay: true
          };
          this.myCal.loadEvents();
        }
        else{
          this.eventSource.push({
            title: data.title,
            desc:data.desc,
            startTime: new Date(data.startTime),
            endTime:new Date(data.endTime),
            sl_no:data.sl_no > 0 ? data.sl_no : res.lastId.insertId,
            allDay: true
           });
           this.myCal.loadEvents();
        }
      }
      this.loader.presentToast(res.msg,res.suc > 0 ? 'S' : 'E');
    },
    err =>{
      this.loader.presentToast('Server not responding! please try again later','E');
    });
  }
}
