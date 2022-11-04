import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-common-card',
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.scss'],
})
export class CardComponent implements OnInit {
  @Output() noteDt: EventEmitter<any> = new EventEmitter<any>();
  @Input() mode: any;
  @Input() noteList: any=[];
  constructor() { }

  ngOnInit() {}
  getDT(notes){
    this.noteDt.emit(notes);
  }
}
