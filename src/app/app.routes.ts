import { Routes } from '@angular/router';
import { Home } from './home/home';
import { SignIn } from './auth/sign-in/sign-in';
import { SignUp } from './auth/sign-up/sign-up';
import { Profile } from './profile/profile';
export const routes: Routes = [
  { path: '', component: Home },
  { path: 'signin', component: SignIn },
  { path: 'signup', component: SignUp },
  { path: 'profile', component: Profile },
];
