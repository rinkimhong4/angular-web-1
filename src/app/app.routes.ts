import { Routes } from '@angular/router';
import { Home } from './home/home';
import { SignIn } from './auth/sign-in/sign-in';
import { SignUp } from './auth/sign-up/sign-up';
import { Profile } from './profile/profile';
import { ProductDetail } from './product-detail/product-detail';
import { Cart } from './cart/cart';
import { Checkout } from './checkout/checkout';
export const routes: Routes = [
  { path: '', component: Home },
  { path: 'product/:id', component: ProductDetail },
  { path: 'cart', component: Cart },
  { path: 'checkout', component: Checkout },
  { path: 'signin', component: SignIn },
  { path: 'signup', component: SignUp },
  { path: 'profile', component: Profile },
];
