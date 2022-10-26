import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-common-segment',
  templateUrl: './segment.component.html',
  styleUrls: ['./segment.component.scss'],
})
export class SegmentComponent implements OnInit {
  @Input() galleryType: any;
  @Output() tabValue: EventEmitter<string>= new EventEmitter();
  constructor() { }

  ngOnInit() {}
  reset(event){
  this.tabValue.emit(event.detail.value);
  }
}
