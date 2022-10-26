
import {Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import { LoanDtls } from 'src/app/Models/loanDtls';
import { Locat } from 'src/app/Models/location';
import { LoaderService } from 'src/app/Service/loader.service';
@Component({
  selector: 'app-common-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss'],
})
export class ListComponent implements OnInit{
  @Input() loanList: LoanDtls[]=[];
  @Input() mode: any;
  @Input() location: Locat;
  @Output() lnDT: EventEmitter<any> = new EventEmitter();
  constructor(private loader: LoaderService,) { }
    ngOnInit() {}
    async openModal(loanDetails) {
     this.lnDT.emit(loanDetails);
    }
}
