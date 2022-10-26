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
    this.setLocation(
      localStorage.getItem('block') ? JSON.parse(localStorage.getItem('block')) : '',
      localStorage.getItem('sArea') ? JSON.parse(localStorage.getItem('sArea')) : '',
      localStorage.getItem('vill') ? JSON.parse(localStorage.getItem('vill')) : '');
  }
  ionViewWillEnter(){
   this.getBlock();
  }
  setLocation(bName,sName,vName){
 this.loct = {
   block: bName,
   sArea:sName,
   village:vName
 };
  }
  submitlocation(){
  this.loader.showLoading('Apply Changes..');
    setTimeout(() =>{
      localStorage.setItem('block',JSON.stringify(this.location.value.block));
      localStorage.setItem('sArea',JSON.stringify(this.location.value.sarea));
      localStorage.setItem('vill',JSON.stringify(this.location.value.village));
      this.setLocation(
        this.location.value.block,
        this.location.value.sarea,
        this.location.value.village,
        );
    this.loader.hideLoading();
    this.loader.presentToast('Changes Applied Successfully','S');
    this.isModalOpen=!this.isModalOpen;
    },3000);
  }
  navigateToPage(){
    // this.router.navigateByUrl('/main/lists');
    this.router.navigate(['/main/lists',
     this.location.value.block.block_id,
     this.location.value.sarea.sa_id,
     this.location.value.village.vill_id]);
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
    this.location.patchValue({
      block:localStorage.getItem('block') ? JSON.parse(localStorage.getItem('block')) : '',
      sarea:localStorage.getItem('sArea') ? JSON.parse(localStorage.getItem('sArea')) : '',
      village:localStorage.getItem('vill') ? JSON.parse(localStorage.getItem('vill')) : ''
    });
    this.isModalOpen=!this.isModalOpen;
  }
}
