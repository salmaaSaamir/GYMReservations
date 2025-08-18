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
import { MatTooltipModule } from '@angular/material/tooltip';
import { GenerateSchaduleComponent } from './classes/generate-schadule/generate-schadule.component';
import { ListMembersComponent } from './members/list-members/list-members.component';
import { AddMemberComponent } from './members/add-member/add-member.component';
import { ListSubscriptionComponent } from './subscription/list-subscription/list-subscription.component';
import { AddSubscriptionComponent } from './subscription/add-subscription/add-subscription.component';
import { ListMemberSubscriptionsComponent } from './members/list-member-subscriptions/list-member-subscriptions.component';
import { ListReservationsComponent } from './reservations/list-reservations/list-reservations.component';
import { AddReservationComponent } from './reservations/add-reservation/add-reservation.component';

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
    ShowClassReservationsComponent,
    GenerateSchaduleComponent,
    ListMembersComponent,
    AddMemberComponent,
    ListSubscriptionComponent,
    AddSubscriptionComponent,
    ListMemberSubscriptionsComponent,
    ListReservationsComponent,
    AddReservationComponent
  ],
  imports: [
    CommonModule,
    ComponentsRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    TablerIconsModule,

    MaterialModule, 
    SharedModule,
    NgxPaginationModule,
    MatTooltipModule
  ],

})
export class ComponentsModule { }
