import { Component, OnInit } from '@angular/core';
import { NavParams, ModalController } from '@ionic/angular';

@Component({
  selector: 'app-common-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.scss'],
})
export class ModalComponent implements OnInit {
  minDate = new Date().toISOString();
  constructor(
    public mdCtrl: ModalController,
    public navParams: NavParams) {
  }
  ngOnInit() {}
  close(){this.mdCtrl.dismiss();}
  save(){
    console.log(this.navParams.data.event);
    this.mdCtrl.dismiss({event: this.navParams.data.event});
  }
}
