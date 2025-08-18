import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ListUsersComponent } from './users/list-users/list-users.component';
import { ListTrainersComponent } from './trainers/list-trainers/list-trainers.component';
import { link } from 'fs';
import { ListClassesComponent } from './classes/list-classes/list-classes.component';
import { ListMemberSubscriptionsComponent } from './members/list-member-subscriptions/list-member-subscriptions.component';
import { ListSubscriptionComponent } from './subscription/list-subscription/list-subscription.component';
import { ListMembersComponent } from './members/list-members/list-members.component';
import { ListReservationsComponent } from './reservations/list-reservations/list-reservations.component';

const routes: Routes = [{
  path: 'users',
  component: ListUsersComponent,
}, {
  path: 'trainers',
  component: ListTrainersComponent,
},
 {
  path: 'classes',
  component: ListClassesComponent,
},
 {
  path: 'subscriptions',
  component: ListSubscriptionComponent,
}, {
  path: 'members',
  component: ListMembersComponent,
},
 {
  path: 'memberSubscriptions',
  component: ListMemberSubscriptionsComponent,
},
 {
  path: 'reservations',
  component: ListReservationsComponent,
},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ComponentsRoutingModule { }
