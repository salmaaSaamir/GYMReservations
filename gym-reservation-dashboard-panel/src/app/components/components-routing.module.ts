import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ListUsersComponent } from './users/list-users/list-users.component';
import { ListTrainersComponent } from './trainers/list-trainers/list-trainers.component';
import { link } from 'fs';
import { ListClassesComponent } from './classes/list-classes/list-classes.component';

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
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ComponentsRoutingModule { }
