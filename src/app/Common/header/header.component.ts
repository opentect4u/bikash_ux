import { DbInteractionService } from './../../Service/db-interaction.service';
import { Component, EventEmitter, Input, Output, ViewChild, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { IonSearchbar } from '@ionic/angular';

@Component({
  selector: 'app-common-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit{
  @ViewChild('autofocus',{static:false}) searchbar: IonSearchbar;
  @Output() modalCalendar: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Input() title: any;
  @Input() showSearchBar: any;
  @Output() searchInput: EventEmitter<string>= new EventEmitter();
  isShowsearchbar = true;
  routeId = Number(this.acRT.snapshot.data.id);
  constructor(
    private router: Router,
    private dbInct: DbInteractionService,
    private acRT: ActivatedRoute) {}
  ngOnInit(): void {localStorage.setItem('route',this.router.url);}
  changeInput(event){this.searchInput.emit(event.target.value);}
  back(){
    this.isShowsearchbar=!this.isShowsearchbar;
    this.searchInput.emit('');
  }
  loggedOut(){this.dbInct.loggedout();}
  focusonSearchbar(){
    setTimeout(() => {
    this.searchbar.setFocus();
    }, 500);
  }
}
