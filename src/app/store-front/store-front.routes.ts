import { Routes } from '@angular/router';
import { IsAuthenticatedGuard } from '@auth/guards/is-authenticated.guard';
import StoreFrontLayoutComponent from './layouts/store-front-layout/store-front-layout.component';

export const frontRoutes: Routes = [
	{
		path:'',
		component: StoreFrontLayoutComponent,
        children:[
            {
                path:'',
                loadComponent: () => import('./pages/home-page/home-page.component')
            },
            {
                path:'gender/:gender',
                loadComponent: () => import('./pages/gender-page/gender-page.component')
            },
            {
                path:'product/:idSlug',
                loadComponent: () => import('./pages/product-page/product-page.component')
            },
            {
                path:'cart',
                loadComponent: () => import('./pages/cart-page/cart-page.component')
            },
            {
                path:'checkout',
                loadComponent: () => import('./pages/checkout-page/checkout-page.component'),
                canMatch: [IsAuthenticatedGuard]
            },
            {
                path:'payment-result',
                loadComponent: () => import('./pages/payment-result-page/payment-result-page.component'),
                canMatch: [IsAuthenticatedGuard]
            },
            {
                path:'orders',
                loadComponent: () => import('./pages/orders-page/orders-page.component'),
                canMatch: [IsAuthenticatedGuard]
            },
            {
                path:'orders/:id',
                loadComponent: () => import('./pages/order-detail-page/order-detail-page.component'),
                canMatch: [IsAuthenticatedGuard]
            },
            {
                path:'**',
                loadComponent: () => import('./pages/not-found-page/not-found-page.component')
            }
        ]
	}

];

export default frontRoutes;
