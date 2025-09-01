import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ComponentsRoutingModule } from './components-routing.module';
import { HomeComponent } from './home/home.component';
import { AboutUsComponent } from './about-us/about-us.component';
import { BlogsComponent } from './blogs/blogs.component';
import { BlogDetailsComponent } from './blog-details/blog-details.component';
import { ItemsComponent } from './items/items.component';
import { ItemDetailsComponent } from './item-details/item-details.component';
import { ContactUsComponent } from './contact-us/contact-us.component';
import { ElementsComponent } from './elements/elements.component';


@NgModule({
  declarations: [
    HomeComponent,
    AboutUsComponent,
    BlogsComponent,
    BlogDetailsComponent,
    ItemsComponent,
    ItemDetailsComponent,
    ContactUsComponent,
    ElementsComponent
  ],
  imports: [
    CommonModule,
    ComponentsRoutingModule
  ]
})
export class ComponentsModule { }
