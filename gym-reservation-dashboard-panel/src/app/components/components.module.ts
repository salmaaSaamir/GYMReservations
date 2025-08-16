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
import { ListTrainersComponent } from './trainers/list-trainers/list-trainers.component';
import { AddTrainerComponent } from './trainers/add-trainer/add-trainer.component';
import { NgxPaginationModule } from 'ngx-pagination';
import { ListClassesComponent } from './classes/list-classes/list-classes.component';
import { AddClassComponent } from './classes/add-class/add-class.component';
import { ShowClassReservationsComponent } from './classes/show-class-reservations/show-class-reservations.component';

@NgModule({
  declarations: [
    ListUsersComponent,
    AddUserComponent,
    AddUserMenuComponent,
    ListTrainersComponent,
    AddTrainerComponent,
    ListTrainersComponent,
    AddTrainerComponent,
    ListClassesComponent,
    AddClassComponent,
    ShowClassReservationsComponent
  ],
  imports: [
    CommonModule,
    ComponentsRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    TablerIconsModule,

    MaterialModule, 
    SharedModule,
    NgxPaginationModule
  ],

})
export class ComponentsModule { }
