import { DbInteractionService } from './../../Service/db-interaction.service';
import {
  Component,
  EventEmitter,
  Input,
  Output,
  ViewChild,
  OnInit,
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { IonSearchbar } from '@ionic/angular';
import { NotificationService } from 'src/app/Service/notification.service';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-common-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit {
  @ViewChild('autofocus', { static: false }) searchbar: IonSearchbar;
  @Output() modalCalendar: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Input() title: any;
  @Input() showSearchBar: any;
  @Output() searchInput: EventEmitter<string> = new EventEmitter();
  @Output() notifications: EventEmitter<number> = new EventEmitter();
  isShowsearchbar = true;
  routeId = Number(this.acRT.snapshot.data.id);
  constructor(
    private notification: NotificationService,
    private router: Router,
    private dbInct: DbInteractionService,
    private acRT: ActivatedRoute
  ) {}
  ngOnInit(): void {
    this.notification.emitSocket();
    this.getNotifications();
    localStorage.setItem('route', this.router.url);
  }
  changeInput(event) {
    this.searchInput.emit(event.target.value);
  }
  back() {
    this.isShowsearchbar = !this.isShowsearchbar;
    this.searchInput.emit('');
  }
  loggedOut() {
    this.dbInct.loggedout();
  }
  focusonSearchbar() {
    setTimeout(() => {
      this.searchbar.setFocus();
    }, 500);
  }
  getNotifications() {
    this.notification
      .getNotifications()
      .pipe(map((x: any) => x.msg))
      .subscribe((res) => {
        this.notifications.emit(
          res.length > 0
            ? res.filter(
                (x: any) => x?.user_id === localStorage.getItem('user_id')
              )
            : []
        );
        this.notification.notifications.next({
          count: res.length > 0 ? res.filter(
            (x: any) => x?.user_id === localStorage.getItem('user_id')
          ).length: 0,
        });
      });
  }
}
