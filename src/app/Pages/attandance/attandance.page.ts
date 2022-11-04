import { Geolocation } from '@capacitor/geolocation';
/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable no-var */
import { LoaderService } from './../../Service/loader.service';
import { DbInteractionService } from './../../Service/db-interaction.service';
import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { map } from 'rxjs/operators';
import Atttiming from 'src/app/Models/timing';
declare var google: any;

@Component({
  selector: 'app-attandance',
  templateUrl: './attandance.page.html',
  styleUrls: ['./attandance.page.scss'],
})
export class AttandancePage implements OnInit {
  showLoader = false;
  lat: any;
  long: any;
  chekedBtn: any = [];
  attandanceTiming = new Atttiming();
  options: PositionOptions = {
    enableHighAccuracy: true,
    timeout: 20000,
  };
  constructor(
    private loader: LoaderService,
    private dbIntr: DbInteractionService,
    private datePipe: DatePipe) {}

  ngOnInit() {
     this.getUserStatus();
  }

  async checkedIn(type) {
    this.loader.showLoading('changing Status...');
      // if(navigator.geolocation){
      //   this.showPosition({coords:{latitude:22.5158623,longitude:88.3868855}},type);
      //  }
    const req = await this.loader.requestPermission();
    if(req === 'granted'){
      await Geolocation.getCurrentPosition(this.options).then((m) =>{
        this.lat = m.coords.latitude;
        this.long = m.coords.longitude;
        this.showPosition(
          {coords:{latitude:m.coords.latitude,
          longitude:m.coords.longitude}},type);
      });
    }
    else{
      setTimeout(() => {
        this.loader.hideLoading();
        this.loader.presentToast('you have not accessed location permission to this app yet','E');
      }, );
    }
  }

  getCurrentTime() {
    return this.datePipe.transform(new Date(), 'hh:mm a');
  }
  getToday() {
    return this.datePipe.transform(new Date(), 'dd/MM/YYYY');
  }
  showPosition(position,type) {
    var lat = position.coords.latitude;
    var long = position.coords.longitude;
    var point = new google.maps.LatLng(lat, long);
    new google.maps.Geocoder().geocode(
      {
        latLng: point,
      },
      (results, status) => {
        if(results.length > 0){
          this.checkedInOrOut(results[0].formatted_address,lat,long,type);
        }
        else{
          this.loader.hideLoading();
          this.loader.presentToast('Unable find any location','E');
        }
      },
      err =>{
        this.loader.hideLoading();
        this.loader.presentToast('Location fetch failed','E');
      }
    );
  }
  checkedInOrOut(location,lat,long,type) {
    let dt;
    if(type === 'I'){
      dt ={
        ardb_id:localStorage.getItem('ardb_id'),
        user_id:localStorage.getItem('user_id'),
        emp_code:localStorage.getItem('emp_code'),
        sl_no:0,
        check_in:this.datePipe.transform(new Date(),'YYYY-MM-dd HH:mma'),
        lat_pos:lat,
        long_pos:long,
        user:localStorage.getItem('user_id'),
        loc_name:location
      };
    }
    else{
      dt ={
        ardb_id:localStorage.getItem('ardb_id'),
        user_id:localStorage.getItem('user_id'),
        emp_code:localStorage.getItem('emp_code'),
        sl_no:this.chekedBtn[0].sl_no,
        check_out:this.datePipe.transform(new Date(),'YYYY-MM-dd HH:mma'),
        lat_pos:lat,
        long_pos:long,
        user:localStorage.getItem('user_id'),
        loc_name:location
      };
    }
    this.dbIntr.callApi(1, 'atten', dt)
    .subscribe((res: any) => {
      this.loader.presentToast(res.suc > 0 ? 'Status change successfully' : 'Submission failed!!',res.suc > 0 ? 'S' : 'E');
      this.loader.hideLoading();
      if(res.suc > 0){
        this.getUserStatus();
      }
    },err=>{
      this.loader.hideLoading();
      this.loader.presentToast('Server not responding,please try again later','E');
    });
  }
  getUserStatus(){
   this.dbIntr.callApi(0,'atten','user_id='+localStorage.getItem('user_id'))
   .pipe((map((x: any) => x.msg)))
   .subscribe(result =>{
    this.chekedBtn = result;
    if(result.length > 0){
      this.attandanceTiming = result[0];
    }
   },
   err => {
    this.loader.presentToast('Server not responding!! please try again later','E');
   });
  }
}
