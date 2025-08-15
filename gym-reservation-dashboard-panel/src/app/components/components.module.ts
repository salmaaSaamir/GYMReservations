import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ComponentsRoutingModule } from './components-routing.module';
import { ListUsersComponent } from './users/list-users/list-users.component';
import { AddUserComponent } from './users/add-user/add-user.component';
import { AddUserMenuComponent } from './users/add-user-menu/add-user-menu.component';
import { TablerIconsModule } from 'angular-tabler-icons';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from '../material.module';
import { SharedModule } from '../shared/shared.module';

@NgModule({
  declarations: [
    ListUsersComponent,
    AddUserComponent,
    AddUserMenuComponent
  ],
  imports: [
    CommonModule,
    ComponentsRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    TablerIconsModule,
  
  MaterialModule,SharedModule
  ],

})
export class ComponentsModule { }
