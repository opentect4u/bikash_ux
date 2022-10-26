/* eslint-disable @typescript-eslint/naming-convention */
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { map } from 'rxjs/operators';
import { LoanDtls } from 'src/app/Models/loanDtls';
import { DbInteractionService } from 'src/app/Service/db-interaction.service';
import { LoaderService } from 'src/app/Service/loader.service';

@Component({
  selector: 'app-pages-generated-list',
  templateUrl: './generated-list.page.html',
  styleUrls: ['./generated-list.page.scss'],
})
export class GeneratedListPage implements OnInit {
  loanList: LoanDtls[]=[];
  filteredData: LoanDtls[]=[];
  list: LoanDtls[]=[];
  showList: any = 10;
  isModalOpen = false;
  lndetails: LoanDtls;
  isPaid = 'N';
  paidAmt = 0;
  location: any ={lat:'',long:''};
  constructor(
    private loader: LoaderService,
    private acRT: ActivatedRoute,
    private db: DbInteractionService) {}
  ionViewWillEnter(){
    this.list = this.loanList.slice(0,this.showList);
    this.getLoanList();
  }
  ngOnInit() {}
  getList(event: string){
    this.list = this.loanList.filter((location) =>
    (location.lf_no.toString().toLowerCase().indexOf(event.toLowerCase()) > -1 ||
    location.cust_name.toString().toLowerCase().indexOf(event.toLowerCase()) > -1));
  }
  loadData(event){
    setTimeout(() =>{
      this.showList+=2;
      this.list = this.loanList.slice(0,this.showList);
      event.target.complete();
      if(this.list.length  === this.loanList.length){
        event.target.disabled = true;
      }
    },1000);
  }
  getLoanList(){
    const dt ={
      ardb_id:localStorage.getItem('ardb_id'),
      block_name:this.acRT.snapshot.params.b_name,
      sa_name:this.acRT.snapshot.params.s_name,
      vill_name:this.acRT.snapshot.params.v_name,
      cust_id:null,
      loan_acc_id:null,
      lf_no:null
    };
    console.log(dt);
    this.db.callApi(1,'loan_data',dt).pipe(map((x: any) => x.msg)).subscribe(res =>{
      console.log(res);
      this.loanList = res;
      this.filteredData = res;
      this.list = res.slice(0,this.showList);
    });
  }
  openModal(event){
    console.log(event);
    this.isModalOpen = !this.isModalOpen;
    const dt ={
      ardb_id:event.ardb_cd,
      block_name:event.br_block_cd,
      sa_name:event.service_area_cd,
      vill_name:event.village_cd,
      cust_id:event.cust_cd,
      loan_acc_id:event.loan_acc_cd,
      lf_no:event.lf_no
    };
    this.db.callApi(1,'loan_data',dt).pipe(map((x: any) => x.msg)).subscribe(res =>{
      this.lndetails = res[0];
      this.isPaid = res[0]?.paid_flag;
      this.paidAmt = res[0].r_amt ? res[0].r_amt : 0;
    });
  }
  change(event){
    console.log(event);
    this.isPaid = event.detail.checked ? 'Y' : 'N';
  }
  async checkPaid(){
    if(this.paidAmt.toString() === '0'){
     this.loader.presentToast('Paid Amount must be greater than 0','E');
    }
    else{
      this.loader.showLoading('please Wait..');
      let dt;
     const req = await this.loader.requestPermission();
     if(req === 'granted'){
             const options: PositionOptions = {
               enableHighAccuracy:true
             };
     this.location = await this.loader.getCurrentLocation(options);
      dt ={
       ardb_id:this.lndetails.ardb_cd,
       block_name:this.lndetails.br_block,
       sa_name:this.lndetails.service_area,
       vill_name:this.lndetails.village,
       cust_id:this.lndetails.cust_cd,
       loan_acc_cd:this.lndetails.loan_acc_cd,
       r_amt:this.paidAmt ? this.paidAmt : 0,
       user:'Suman Mitra',
       lat_pos: this.location.coords?.latitude,
       long_pos:this.location.coords?.longitude
      };
     }
     else{
     dt ={
        ardb_id:this.lndetails.ardb_cd,
        block_name:this.lndetails.br_block,
        sa_name:this.lndetails.service_area,
        vill_name:this.lndetails.village,
        cust_id:this.lndetails.cust_cd,
        loan_acc_cd:this.lndetails.loan_acc_cd,
        r_amt:this.paidAmt ? this.paidAmt : 0,
        user:'Suman Mitra',
        lat_pos: this.location?.lat,
        long_pos:this.location?.long
    };
     }
    //  console.log(this.location);
      this.db.callApi(1,'loan_data_save',dt).subscribe((res: any) =>{
        setTimeout(() => {
          this.loader.hideLoading();
          if(res.suc > 0){
            this.list[this.list.findIndex((x: any) => x.cust_cd === this.lndetails.cust_cd)].paid_flag = this.isPaid;
            this.isModalOpen = !this.isModalOpen;
          }
          this.loader.presentToast(res.suc > 0 ? 'Paid Successfully' : 'Something wrong happened',res.suc > 0 ? 'S' : 'E');
        }, 3000);
      },
      err =>{
        this.loader.hideLoading();
        this.loader.presentToast('Submittion Failed! Please try again later','E');
      });
    }
  }
}
