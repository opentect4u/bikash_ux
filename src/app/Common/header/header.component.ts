import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { IonSearchbar } from '@ionic/angular';

@Component({
  selector: 'app-common-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit {
  @Input() title: any;
  @Input() showSearchBar: any;
  @Output() searchInput: EventEmitter<string>= new EventEmitter();
  isShowsearchbar = true;
  routeId = Number(this.acRT.snapshot.data.id);
  constructor(private router: Router,private acRT: ActivatedRoute) { }

  ngOnInit() {
    localStorage.setItem('route',this.router.url);
  }
  changeInput(event){
    console.log(event.target.value);
    this.searchInput.emit(event.target.value);
  }

}
