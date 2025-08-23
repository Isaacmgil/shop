import { ProductImagePipe } from '@/products/pipes/product-image-pipe';
import { ProductsService } from '@/products/services/products.service';
import { Component, computed, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-favorites',
  imports: [RouterLink, ProductImagePipe],
  templateUrl: './favorites.component.html',
})
export class FavoritesComponent {

  productsService = inject(ProductsService);
  showFavoritesPopup = signal(false);

  favoritesCount = computed(() => this.productsService.favorites().length);

    toggleFavoritesPopup(): void {
    this.showFavoritesPopup.update(value => !value);
  }



}
