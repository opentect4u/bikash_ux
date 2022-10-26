import { Component, OnInit } from '@angular/core';
import TabMenu from '../../assets/TabMenu.json';
@Component({
  selector: 'app-main',
  templateUrl: './main.page.html',
  styleUrls: ['./main.page.scss'],
})
export class MainPage implements OnInit {
  public menu = TabMenu;
  constructor() { }
  ngOnInit() {
  }

}
