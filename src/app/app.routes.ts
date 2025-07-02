import { Routes } from '@angular/router';
import { HomepageComponent } from './homepage/homepage.component';
import { AnimalComponent } from './animal/animal.component';
import { EndangeredAnimalPageComponent } from './endangered-animal-page/endangered-animal-page.component';
import { QuizComponent } from './animal-quiz/animal-quiz.component';


export const routes: Routes = [
  { path: '', component: HomepageComponent },         // Homepage as default
  {path: 'endangered-animal', component: EndangeredAnimalPageComponent },
  {path: 'animal', component: AnimalComponent },
  { path: 'animal-quiz', component: QuizComponent },
];
