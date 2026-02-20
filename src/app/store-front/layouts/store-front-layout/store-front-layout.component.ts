import { Component, inject } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { FrontNavbarComponent } from "../../components/front-navbar/front-navbar.component";
import { CartSidebarComponent } from "@cart/components/cart-sidebar/cart-sidebar.component";
import { CartService } from "@cart/services/cart.service";

@Component({
  selector: 'app-store-front-layout',
  imports: [RouterModule, FrontNavbarComponent, CartSidebarComponent],
  templateUrl: './store-front-layout.component.html',
})
export default class StoreFrontLayoutComponent {
  cartService = inject(CartService);
}
