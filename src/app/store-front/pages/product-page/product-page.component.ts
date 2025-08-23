import { ProductsService } from '@/products/services/products.service';
import { Component, computed, inject, signal } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductCarouselComponent } from "@/products/components/product-carousel/product-carousel.component";
import { AuthService } from '@/auth/services/auth-service';
import { map, switchMap } from 'rxjs';
import { FavoritesComponent } from "@/store-front/components/favorites/favorites.component";
import { ShoppingCartComponent } from "@/store-front/components/shopping-cart/shopping-cart.component";

@Component({
  selector: 'app-product-page',
  imports: [ProductCarouselComponent, FavoritesComponent, ShoppingCartComponent],
  templateUrl: './product-page.component.html',
})
export class ProductPageComponent {

  activatedRoute = inject(ActivatedRoute);
  productsService = inject(ProductsService);
  authService = inject(AuthService);
  router = inject(Router);

  productResource = rxResource({
    request: () => this.activatedRoute.paramMap,
    loader: ({ request }) => {
      return request.pipe(
        map(params => params.get('idSlug')),
        switchMap(idSlug => {
          if (!idSlug) {
            return this.productsService.getProductByIdSlug('not-found');
          }
          return this.productsService.getProductByIdSlug(idSlug);
        })
      );
    }
  });

  selectedSize = signal<string | null>(null);
  showFavoritesPopup = signal(false);
  showProductsCart = signal(false);
  isAuthenticated = computed(() => this.authService.isLoggedIn());

  isFavorite = computed(() => {
    const product = this.productResource.value();
    if (!product || !product.id) {
      return false;
    }
    return this.productsService.favorites().some(p => p.id === product.id);
  });

  onSelectSize(size: string): void {
    this.selectedSize.set(size);
  }

  onToggleFavorite(): void {
    if (!this.isAuthenticated()) {
      this.router.navigateByUrl('/auth/login');
      return;
    }

    const product = this.productResource.value();
    if (product) {
      this.productsService.toggleFavorite(product);
    }
  }

  onToggleCart(): void {
    if (!this.isAuthenticated()) {
      this.router.navigateByUrl('/auth/login');
      return;
    }

    const product = this.productResource.value();
    if (product) {
      this.productsService.toggleCart(product);
    }
  }

}
