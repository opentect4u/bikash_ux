
import {AfterViewInit, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { LoanDtls } from 'src/app/Models/loanDtls';
import { Locat } from 'src/app/Models/location';
@Component({
  selector: 'app-common-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss'],
})
export class ListComponent implements OnInit,AfterViewInit{
  @Input() loanList: LoanDtls[]=[];
  @Input() mode: any;
  @Input() location: Locat;
  @Output() lnDT: EventEmitter<any> = new EventEmitter();
  isLoad = true;
  constructor() { }
    ngOnInit() {}
    async openModal(loanDetails) {this.lnDT.emit(loanDetails);}
    ngAfterViewInit(){
     setTimeout(() => {
      this.isLoad =false;
      console.log(this.location);
     }, 2000);
    }
}
