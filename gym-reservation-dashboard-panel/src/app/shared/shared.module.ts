import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SharedRoutingModule } from './shared-routing.module';
import { LoaderComponent } from './loader/loader.component';
import { NotificationsComponent } from './notifications/notifications.component';
import { TranslateModule } from '@ngx-translate/core';


@NgModule({
  declarations: [
    LoaderComponent,
    NotificationsComponent
  ],
  imports: [
    CommonModule,
    SharedRoutingModule,TranslateModule
  ],
  exports: [
    LoaderComponent,
    NotificationsComponent
  ]
})
export class SharedModule { }
