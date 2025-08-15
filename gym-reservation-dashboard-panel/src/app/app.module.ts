import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TablerIconsModule } from 'angular-tabler-icons';
import * as TablerIcons from 'angular-tabler-icons/icons'; // <-- Import all icons
import { AppRoutingModule } from './app-routing.module';
import { RouterModule, RouterOutlet } from '@angular/router';
import { ComponentsModule } from './components/components.module';
import { MaterialModule } from './material.module';
import { AppComponent } from './app.component';
import { HttpClientModule } from '@angular/common/http';
import { ToastrModule } from 'ngx-toastr';

@NgModule({
  declarations: [
    AppComponent
    // Your components here
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    RouterOutlet, // <-- Import RouterOutlet for routing
    RouterModule,
    HttpClientModule,
    ReactiveFormsModule,
    ComponentsModule,
    AppRoutingModule,
    TablerIconsModule.pick(TablerIcons), // <-- Pick all icons
    MaterialModule, ToastrModule.forRoot()    

  ],
  bootstrap: [AppComponent] // <-- Bootstrap it

})
export class AppModule { }
