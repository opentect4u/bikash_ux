
import { Component,OnInit} from '@angular/core';
import {Router } from '@angular/router';
import { PopoverController } from '@ionic/angular';
import TabMenu from '../../assets/TabMenu.json';
import { PopOverComponent } from '../Common/pop-over/pop-over.component';
@Component({
  selector: 'app-main',
  templateUrl: './main.page.html',
  styleUrls: ['./main.page.scss'],
})
export class MainPage implements OnInit {
  public menu = TabMenu;
  constructor(
    public router: Router,
    public popoverController: PopoverController
    ) {}
  ngOnInit() {}
 async openAlert(ev){
  const popover = await this.popoverController.create({
    component:PopOverComponent,
    mode:'ios',
    event:ev,
    componentProps:{data:[
      {label:'Tour Diary',value:'D'},
      {label:'Tour Program',value:'P'}
      ,{label:'Attandance',value:'A'}
    ]}
  });
  await popover.present();
   await popover.onDidDismiss().then((m: any) =>{
    if(m.data){
        switch(m.data.type){
          case 'D' :this.router.navigate(['/main/notes']);break;
          case 'P' : this.router.navigate(['/main/schedule']); break;
          case 'A' : this.router.navigate(['/main/atn']); break;
          default  : break;
        }
    }
   });
  }
}
