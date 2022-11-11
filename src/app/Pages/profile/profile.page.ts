import { Component, OnInit } from '@angular/core';
import { DbInteractionService } from 'src/app/Service/db-interaction.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage implements OnInit {
  userDT = localStorage;
  constructor(
    private db: DbInteractionService) { }
  ngOnInit() {}
  logout(){
    this.db.loggedout();
  }
}
