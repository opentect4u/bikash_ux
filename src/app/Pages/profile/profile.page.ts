import { Component, OnInit } from '@angular/core';
import { LoaderService } from 'src/app/Service/loader.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage implements OnInit {

  constructor(private service: LoaderService) { }

  ngOnInit() {
  }

  logout(){
  localStorage.clear();
  this.service.navigateToParicularPage('/',null);
  }

}
