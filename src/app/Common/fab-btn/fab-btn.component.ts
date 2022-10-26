import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-common-fab-btn',
  templateUrl: './fab-btn.component.html',
  styleUrls: ['./fab-btn.component.scss'],
})
export class FabBtnComponent implements OnInit {
  @Input()  vl: any;
  @Input()  hl: any;

  constructor(private router: Router) { }

  ngOnInit() {}
  logout(){
    console.log('asd');
    localStorage.clear();
    this.router.navigate(['/']);
  }
  routeToPage(){this.router.navigate(['/main/changeprofile']);}
}
