import { BehaviorSubject } from 'rxjs';
/* eslint-disable @typescript-eslint/naming-convention */
import { Injectable } from '@angular/core';
import { Socket } from 'ngx-socket-io';
import { Observable } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  notifications: BehaviorSubject<any> = new BehaviorSubject<any>({count:0});
  $notifications = this.notifications.asObservable();
 constructor(
  private socket: Socket
  ){
 }
 connectToSocket(){
  console.log('sss');
  this.socket.connect();
 }
 disconnectSocket(){
  this.socket.disconnect();
 }
 getNotifications(){
  return new Observable((observer)=>{
    this.socket.fromEvent('notification').subscribe(res =>{
      console.log(res);
      observer.next(res);
    });
  });
 }
 emitSocket(){
  this.socket.emit('notification',{ardb_id:localStorage.getItem('ardb_id'),user_id:localStorage.getItem('user_id'),max:10});
 }
}
