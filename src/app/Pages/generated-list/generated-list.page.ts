/* eslint-disable @typescript-eslint/naming-convention */
import { PopOverComponent } from './../../Common/pop-over/pop-over.component';
import { Component, OnInit } from '@angular/core';
import { map } from 'rxjs/operators';
import { LoanDtls } from 'src/app/Models/loanDtls';
import { DbInteractionService } from 'src/app/Service/db-interaction.service';
import { LoaderService } from 'src/app/Service/loader.service';
import { PopoverController } from '@ionic/angular';
import { UtilityM } from 'src/app/Utility/utilityEvent';
@Component({
  selector: 'app-pages-generated-list',
  templateUrl: './generated-list.page.html',
  styleUrls: ['./generated-list.page.scss'],
})
export class GeneratedListPage implements OnInit {
  loanList: LoanDtls[]=[];
  TotDemand = 0;
  filteredData: LoanDtls[]=[];
  list: LoanDtls[]=[];
  showList: any = 10;
  isModalOpen = false;
  Total_amt = 0;
  lndetails: LoanDtls;
  header_name: any;
  type: any = 'T';
  isPaid = 'N';
  paidAmt = 0;
  isSubModalopen = false;
  location: any ={lat:'',long:''};
  constructor(
    public popoverController: PopoverController,
    private loader: LoaderService,
    private db: DbInteractionService) {}
  ionViewWillEnter(){
    this.list = this.loanList.slice(0,this.showList);
    this.getLoanList();
  }
  ngOnInit() {}
  getList(event: string){
    console.log(event);
    this.list = this.loanList.filter((location) =>
    (location?.acc_num?.toString().toLowerCase().indexOf(event.toLowerCase()) > -1 ||
    location?.loan_acc_cd?.toString().toLowerCase().indexOf(event.toLowerCase()) > -1 ||
    location?.cust_name?.toString().toLowerCase().indexOf(event.toLowerCase()) > -1));
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
      block_name:localStorage.getItem('block_id'),
      sa_name:localStorage.getItem('sa_id'),
      vill_name:localStorage.getItem('vill_id'),
      cust_id:null,
      loan_acc_id:null,
      lf_no:null
    };
    this.db.callApi(1,'loan_data',dt).pipe(map((x: any) => x.msg)).subscribe(res =>{
      this.loanList = res;
      this.filteredData = res;
      this.list = res.slice(0,this.showList);
      console.log(this.loanList);
    });
  }
  openModal(event){
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
      this.Total_amt = 0;
      this.TotDemand = 0;
      this.lndetails = res[0];
      if(this.lndetails.trans_dt.length > 0){
        this.lndetails.trans_dt.forEach(amt =>{
             this.Total_amt +=amt.r_amt;
        });
       }
       this.TotDemand = (this.lndetails.curr_prn_demand +
                         this.lndetails.ovd_prn_demand +
                         this.lndetails.curr_intt_demand +
                         this.lndetails.ovd_intt_demand +
                         this.lndetails.penal_intt_demand);
      this.isPaid = res[0]?.paid_flag;
      this.paidAmt = 0;
    });
  }
  change(event){
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
       acc_num:this.lndetails.acc_num,
       cust_id:this.lndetails.cust_cd,
       loan_acc_cd:this.lndetails.loan_acc_cd,
       r_amt:this.paidAmt ? this.paidAmt : 0,
       user:localStorage.getItem('name'),
       lat_pos: this.location.coords?.latitude,
       long_pos:this.location.coords?.longitude
      };
     }
     else{
     dt ={
        ardb_id:this.lndetails.ardb_cd,
        acc_num:this.lndetails.acc_num,
        cust_id:this.lndetails.cust_cd,
        loan_acc_cd:this.lndetails.loan_acc_cd,
        r_amt:this.paidAmt ? this.paidAmt : 0,
        user:localStorage.getItem('name'),
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
  async showMenu(ev: any){
    const popover = await this.popoverController.create({
      component:PopOverComponent,
      translucent: true,
      event:ev,
      componentProps:{data:[
        {label:'More',value:'M'},
        {label:'Transactions History',value:'T'}
      ]}
    });
    await popover.present();
     await popover.onDidDismiss().then((m) =>{
        if(m.data){
          this.type = m.data?.type;
          this.header_name = this.type === 'M' ? 'More Details' : 'Transactions History';
          this.isSubModalopen = !this.isSubModalopen;
        }
     });
  }
  preventNonNumeric(ev){
    UtilityM.preventNonNumeric(ev);
  }
}
