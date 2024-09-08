import { Routes } from '@angular/router';
import { CategoryProductsComponent } from './pages/website/category-products/category-products.component';
import { CheckoutComponent } from './pages/website/checkout/checkout.component';
import { LandingComponent } from './pages/website/landing/landing.component';
import { WebProductsComponent } from './pages/website/web-products/web-products.component';
import { LoginComponent } from './pages/admin/login/login.component';

export const routes: Routes = [
    {
      path: '',
      redirectTo: 'login',
      pathMatch: 'full'
    },
    {
      path: 'login',
      component: LoginComponent
    },
    {
      path: '',
      component: LandingComponent,
      children: [
        {
          path: 'AllProducts',
          component: WebProductsComponent,
          title: 'All-Products'
        },
        {
          path: 'products/:id',
          component: CategoryProductsComponent
        },
      ]
    },
    {
      path: 'checkout',
      component: CheckoutComponent,
    //   canActivate: [authGuard],
      title: 'Checkout'
    },  
  ];
