import { Routes } from '@angular/router';
import { HomepageComponent } from './homepage/homepage.component';
import { AboutComponent } from './about/about.component';

export const routes: Routes = [
  { path: '', component: HomepageComponent },         // Homepage as default
  { path: 'about', component: AboutComponent },
];
