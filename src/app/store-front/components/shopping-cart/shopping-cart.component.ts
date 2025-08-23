import { ProductImagePipe } from '@/products/pipes/product-image-pipe';
import { ProductsService } from '@/products/services/products.service';
import { CurrencyPipe } from '@angular/common';
import { Component, computed, signal, inject } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-shopping-cart',
  imports: [RouterLink, CurrencyPipe, ProductImagePipe],
  templateUrl: './shopping-cart.component.html',
})
export class ShoppingCartComponent {

  showProductsCart = signal(false);
  productsService = inject(ProductsService);

  toggleCartPopup(): void {
    this.showProductsCart.update(value => !value);
  }

  productsCartCount = computed(() => this.productsService.cart().length);

  public totalCost = computed(() => {
    const cart = this.productsService.cart();
    return cart.reduce((sum, product) => sum + product.price, 0);
  });


}
