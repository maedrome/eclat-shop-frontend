import { Routes } from "@angular/router";
import { AdminDashboardLayoutComponent } from "./layout/admin-dashboard-layout/admin-dashboard-layout.component";
import { ProductsAdminPageComponent } from "./pages/products-admin-page/products-admin-page.component";
import { ProductAdminPageComponent } from "./pages/product-admin-page/product-admin-page.component";
import { OrdersAdminPageComponent } from "./pages/orders-admin-page/orders-admin-page.component";
import { OrderAdminPageComponent } from "./pages/order-admin-page/order-admin-page.component";

export const adminDashboardRoutes : Routes = [
    {
        path:'',
        component: AdminDashboardLayoutComponent,
        children: [
            {
                path:'products',
                component: ProductsAdminPageComponent
            },
            {
                path:'products/:id',
                component: ProductAdminPageComponent
            },
            {
                path:'orders',
                component: OrdersAdminPageComponent
            },
            {
                path:'orders/:id',
                component: OrderAdminPageComponent
            },
            {
                path:'**',
                redirectTo: ''
            }

        ]
    }
]

export default adminDashboardRoutes