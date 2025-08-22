import { ProductsService } from '@/products/services/products.service';
import { Component, computed, inject, signal } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { ActivatedRoute, RouterLink, Router } from '@angular/router'; // ⚠️ Added Router
import { ProductCarouselComponent } from "@/products/components/product-carousel/product-carousel.component";
import { ProductImagePipe } from '@/products/pipes/product-image-pipe';
import { AuthService } from '@/auth/services/auth-service'; // ⚠️ Added AuthService

@Component({
  selector: 'app-product-page',
  imports: [ProductCarouselComponent, RouterLink, ProductImagePipe],
  templateUrl: './product-page.component.html',
})
export class ProductPageComponent {

  activatedRoute = inject(ActivatedRoute);
  productService = inject(ProductsService);
  authService = inject(AuthService); // ⚠️ Inyectamos el servicio de autenticación
  router = inject(Router); // ⚠️ Inyectamos el router

  productIdSlug = this.activatedRoute.snapshot.params['idSlug'];

  productResource = rxResource({
    request: () => ({ idSlug: this.productIdSlug }),
    loader: ({ request }) => {
      return this.productService.getProductByIdSlug(request.idSlug);
    }
  });

  selectedSize = signal<string | null>(null);
  showFavoritesPopup = signal(false);
  isAuthenticated = computed(() => this.authService.isLoggedIn());

  isFavorite = computed(() => {
    const product = this.productResource.value();
    if (!product || !product.id) {
      return false;
    }
    return this.productService.favorites().some(p => p.id === product.id);
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
      this.productService.toggleFavorite(product);
    }
  }

  toggleFavoritesPopup(): void {
    this.showFavoritesPopup.update(value => !value);
  }

  favoritesCount = computed(() => this.productService.favorites().length);

}
