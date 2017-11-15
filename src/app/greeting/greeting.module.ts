import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { GreetingRoutingModule } from './greeting-routing.module';
import { GreetingService } from './greeting.service';
import { GreetingComponent } from './greeting.component';
import { GreetingListComponent } from './list/greeting-list.component';
import { GreetingDetailComponent } from './detail/greeting-detail.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    GreetingRoutingModule
  ],
  declarations: [
    GreetingComponent,
    GreetingListComponent,
    GreetingDetailComponent
  ],
  providers: [
    GreetingService
  ]
})
export class GreetingModule { }
