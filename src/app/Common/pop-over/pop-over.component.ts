
import { Component, OnInit } from '@angular/core';
import { NavParams, PopoverController } from '@ionic/angular';

@Component({
  selector: 'app-common-pop-over',
  templateUrl: './pop-over.component.html',
  styleUrls: ['./pop-over.component.scss'],
})
export class PopOverComponent implements OnInit {

  constructor(
    public popoverController: PopoverController,
    public navParams: NavParams) {}

  ngOnInit() {
  }
  send(_type){
    console.log(_type);
    this.popoverController.dismiss({type: _type});
  }
}
