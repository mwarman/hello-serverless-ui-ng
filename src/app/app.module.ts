import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';


import { AppComponent } from './app.component';
import { GreetingService } from './greeting.service';
import { GreetingListComponent } from './greeting-list/greeting-list.component';
import { GreetingDetailComponent } from './greeting-detail/greeting-detail.component';
import { AppRoutingModule } from './/app-routing.module';
import { DashboardComponent } from './dashboard/dashboard.component';


@NgModule({
  declarations: [
    AppComponent,
    GreetingListComponent,
    GreetingDetailComponent,
    DashboardComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpClientModule,
    AppRoutingModule
  ],
  providers: [ GreetingService ],
  bootstrap: [AppComponent]
})
export class AppModule { }
