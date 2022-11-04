/* eslint-disable @typescript-eslint/naming-convention */
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Locat } from 'src/app/Models/location';
import { DbInteractionService } from 'src/app/Service/db-interaction.service';
import { LoaderService } from 'src/app/Service/loader.service';
import {map} from 'rxjs/operators';
import { Block } from 'src/app/Models/block';
import { ServiceArea } from 'src/app/Models/service-area';
import { Village } from 'src/app/Models/village';
@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {
  loct: Locat;
  block: Block[]=[];
  sArea: ServiceArea[]=[];
  village: Village[]=[];
  location: FormGroup;
  userDtls = localStorage;
  isModalOpen= false;
  constructor(private router: Router,
              private loader: LoaderService,
              private db: DbInteractionService) {
                this.location = new FormGroup({
                  block:new FormControl(localStorage.getItem('block') ?
                  JSON.parse(localStorage.getItem('block')) : '',[Validators.required]),
                  sarea:new FormControl(localStorage.getItem('sArea') ?
                  JSON.parse(localStorage.getItem('sArea')) : '',[Validators.required]),
                  village:new FormControl(localStorage.getItem('vill') ?
                  JSON.parse(localStorage.getItem('vill')) : '',[Validators.required])
                });
              }

  ngOnInit() {
  }
  ionViewWillEnter(){
   this.getBlock();
   this.getdtlsByID(Number(localStorage.getItem('block_id')));
  }
  getdtlsByID(blockId){
   if(blockId > 0){
     this.db.callApi(0,'block_list','id='+blockId+'&ardb_id='+localStorage.getItem('ardb_id'))
     .pipe(map((x: any) => x.msg))
     .subscribe(res =>{
              if(res.length > 0){
                 this.getServiceAreaByblockID(res[0]);
                 setTimeout(() => {
                 this.getServiceArea(res[0]);
                 }, 2000);
              }
     });
   }
  }
  getServiceAreaByblockID(blk){
    this.db.callApi(0,'sa_list','id='+localStorage.getItem('sa_id')
    +'&ardb_id='+localStorage.getItem('ardb_id')
    +'&block_id='+blk?.block_id).
    pipe((map((x: any) => x.msg))).
    subscribe(sa =>{
       if(sa.length > 0){
       this.getVillageByID(sa[0],blk);
       setTimeout(() => {
       this.getVillage(sa[0]);
       }, 3000);
       }
    });
  }

  getVillageByID(sa,_block){
    this.db.callApi(0,'vill_list',
    'id='+localStorage.getItem('vill_id')
    +'&ardb_id='+localStorage.getItem('ardb_id')
    +'&block_id='+_block?.block_id
    +'&sa_id='+sa?.sa_id).
    pipe(map((x: any) => x.msg)).subscribe(vill =>{
           if(vill.length > 0){
            this.setLocation(
              _block,
              sa,
              vill[0]);
              this.location.patchValue({
                block: _block,
                sarea: sa,
                village: vill[0]
              });
           }
    });
  }

  setLocation(bName,sName,vName){
 this.loct = {
   block: bName,
   sArea:sName,
   village:vName
 };
  }
  submitlocation(){
  this.loader.showLoading('Applying Changes..');
  const dt ={
    user_id:localStorage.getItem('user_id'),
    block_id:this.location.value.block.block_id,
    sa_id:this.location.value.sarea.sa_id,
    vill_id: this.location.value.village.vill_id,
    user_name:localStorage.getItem('name'),
    user:localStorage.getItem('name'),
    ardb_id:localStorage.getItem('ardb_id')
  };
  this.db.callApi(1,'save_params',dt)
  .pipe(map((x: any) => x.suc))
  .subscribe(res =>{
     if(res > 0){
      localStorage.setItem('block_id',this.location.value.block.block_id);
      localStorage.setItem('sa_id',this.location.value.sarea.sa_id);
      localStorage.setItem('vill_id',this.location.value.village.vill_id);
      this.setLocation(this.location.value.block,this.location.value.sarea,this.location.value.village);
      setTimeout(() => {
        this.loader.hideLoading();
        this.isModalOpen=!this.isModalOpen;
        this.loader.presentToast('Changes Applied Successfully','S');
      }, 3000);
     }
     else{
      setTimeout(() => {
        this.loader.hideLoading();
        this.loader.presentToast('Something went wrong','E');
      }, 3000);
     }
  },
  error => {
    this.loader.hideLoading();
    this.loader.presentToast('Server not responds','E');
  });

  }
  navigateToPage(){
    if(this.loct.block){
      this.router.navigate(['/main/lists']);
    }
    else{
      this.loader.presentToast('Location not selected!','E');
    }
  }
  getBlock(){
    this.db.callApi(0,'block_list','ardb_id='+localStorage.getItem('ardb_id'))
    .pipe(map((x: any) => x.msg)).subscribe(res =>{
       this.block = res;
    });
  }
  getServiceArea(block){
    this.db.callApi(0,'sa_list','ardb_id='+block.ardb_id+'&block_id='+block.block_id)
    .pipe(map((x: any) => x.msg)).subscribe(res =>{
        console.log(res);
       this.sArea = res;
    });
  }
  getVillage(sArea){
    this.db.callApi(0,'vill_list','ardb_id='+sArea.ardb_id+'&block_id='+sArea.block_id+'&sa_id='+sArea.sa_id)
    .pipe(map((x: any) => x.msg)).subscribe(res =>{
      this.village =res;
    });
  }
  changelocation(event,type){
    console.log(type);
    switch(type){
      case 'B':
                this.getServiceArea(event.value);
                this.location.patchValue({
                  village:'',
                  sarea:''
                });
                break;
      case 'S':
                this.getVillage(event.value);
                this.location.patchValue({
                  village:''
                });
                break;
      default:break;
    }
  }
  locationSet(){
    this.isModalOpen=!this.isModalOpen;
  }

}
