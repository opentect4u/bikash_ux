import { DbInteractionService } from 'src/app/Service/db-interaction.service';
import { Component, Input, OnInit, EventEmitter, Output } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-common-fab-btn',
  templateUrl: './fab-btn.component.html',
  styleUrls: ['./fab-btn.component.scss'],
})
export class FabBtnComponent implements OnInit {
  @Output() opneModal: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Input()  vl: any;
  @Input()  hl: any;
  routerDT: any;
  constructor(
    private acRT: ActivatedRoute,
    private router: Router,
    private db: DbInteractionService) { }

  ngOnInit() {
    this.acRT.data.subscribe(res =>{
      console.log(res);
      this.routerDT = res.id;
    });
  }
  logout(){
    this.db.loggedout();
  }
  routeToPage(){this.router.navigate(['/main/changeprofile']);}
  modalChange(){
  this.opneModal.emit(true);
  }
}
