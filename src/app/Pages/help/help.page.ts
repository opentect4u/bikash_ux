import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-help',
  templateUrl: './help.page.html',
  styleUrls: ['./help.page.scss'],
})
export class HelpPage implements OnInit {
  notify: any =[];
  constructor(
  ) {}
  ngOnInit() {}
  getNotificationCount(ev){
    console.log(ev);
    this.notify = ev;
  }
}
