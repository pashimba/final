import { Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { ProfileComponent } from './pages/profile/profile.component';
import { HomeComponent } from './pages/home/home.component';
import { SearchComponent } from './pages/search/search.component';
import { RegisterComponent } from './pages/register/register.component';
import { FeedComponent } from './pages/feed/feed.component';
import { EditProfileComponent } from './pages/edit-profile/edit-profile.component';
import { NewPostComponent } from './pages/new-post/new-post.component';
import { ViewProfileComponent } from './pages/view-profile/view-profile.component';
import { ViewEventsComponent } from './pages/view-events/view-events.component';
import { EventoFormComponent } from './pages/evento-form/evento-form.component';


export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'profile', component: ProfileComponent },
  { path: 'home', component: HomeComponent },
  { path: 'search', component: SearchComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'feed', component: FeedComponent },
  { path: 'edit-profile', component: EditProfileComponent },
  { path: 'new-post', component: NewPostComponent },
  { path: 'view-post/:id', component: NewPostComponent },
  { path: 'view-profile/:id', component: ViewProfileComponent },
  { path: 'view-events', component: ViewEventsComponent },
  { path: 'evento-form/create', component: EventoFormComponent }, // crear evento
  { path: 'evento-form/:action/:id', component: EventoFormComponent }  // editar, leer o borrar evento


];
