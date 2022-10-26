import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { IncludeModule } from '../include/include.module';
import { CardComponent } from './card/card.component';
import { FabBtnComponent } from './fab-btn/fab-btn.component';
import { HeaderComponent } from './header/header.component';
import { ListComponent } from './list/list.component';
import { SegmentComponent } from './segment/segment.component';
@NgModule({
  declarations: [
    SegmentComponent,
    HeaderComponent,
    ListComponent,
    FabBtnComponent,
    CardComponent],
  imports: [
    CommonModule,
    IonicModule,
    IncludeModule],
  exports: [SegmentComponent,FabBtnComponent,IncludeModule,HeaderComponent,ListComponent,CardComponent],
})
export class SharedModule {}
