import { Component, OnInit } from '@angular/core';
import { AndroidPermissions } from '@ionic-native/android-permissions/ngx';
import { Uid } from '@ionic-native/uid/ngx';
@Component({
  selector: 'app-mainauth',
  templateUrl: './main.page.html',
  styleUrls: ['./main.page.scss'],
})
export class MainAuthPage implements OnInit {
  constructor(private uid: Uid, private androidPermissions: AndroidPermissions) {  this.getImei(); }

  ngOnInit() {
  }
  async getImei() {
    const { hasPermission } = await this.androidPermissions.checkPermission(
      this.androidPermissions.PERMISSION.READ_PHONE_STATE
    );
    if (!hasPermission) {
      const result = await this.androidPermissions.requestPermission(
        this.androidPermissions.PERMISSION.READ_PHONE_STATE
      );
      if (!result.hasPermission) {
        throw new Error('Permissions required');
      }
      // ok, a user gave us permission, we can get him identifiers after restart app
      // return;
    }
     console.log(this.uid.IMEI);
   }
}
