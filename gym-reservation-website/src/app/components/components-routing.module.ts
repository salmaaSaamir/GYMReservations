import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { HomeComponent } from "./home/home.component";
import { AboutUsComponent } from "./about-us/about-us.component";
import { ItemsComponent } from "./items/items.component";
import { ElementsComponent } from "./elements/elements.component";
import { ContactUsComponent } from "./contact-us/contact-us.component";
import { BlogDetailsComponent } from "./blog-details/blog-details.component";
import { BlogsComponent } from "./blogs/blogs.component";
import { ItemDetailsComponent } from "./item-details/item-details.component";

const routes: Routes = [
  {
    path: "",
    component: HomeComponent,
  },
  {
    path: "about",
    component: AboutUsComponent,
  },
  {
    path: "items",
    component: ItemsComponent,
  },
  {
    path: "elements",
    component: ElementsComponent,
  },

  {
    path: "blogs",
    component: BlogsComponent,
  },
  
  {
    path: "s-blog",
    component: BlogDetailsComponent,
  },
  
  {
    path: "s-item",
    component: ItemDetailsComponent,
  },
  {
    path: "contact",
    component: ContactUsComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ComponentsRoutingModule {}
