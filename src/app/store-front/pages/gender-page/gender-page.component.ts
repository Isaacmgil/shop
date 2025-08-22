
import { ProductsService } from '@/products/services/products.service';
import { Component, computed, inject, signal } from '@angular/core';
import { rxResource, toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { map } from 'rxjs';
import { ProductCardComponent } from "@/products/components/product-card/product-card.component";
import { PaginationComponent } from '@/shared/components/pagination/pagination.component';
import { PaginationService } from '@/shared/components/pagination/pagination.service';
import { ProductImagePipe } from '@/products/pipes/product-image-pipe';

@Component({
  selector: 'gender-page',
  imports: [ProductCardComponent, PaginationComponent, RouterLink, ProductImagePipe],
  templateUrl: './gender-page.component.html',
})

export class GenderPageComponent {

  paginationService = inject(PaginationService);
  route = inject(ActivatedRoute);
  gender = toSignal(
    this.route.params.pipe(
      map(({ gender }) => gender)
    )
  )

  productsService = inject(ProductsService);

  productsResource = rxResource({
    request: () => ({gender: this.gender(), page: this.paginationService.currentPage() - 1}),
    loader: ({ request }) => {

      return this.productsService.getProducts({
        gender: request.gender,
        offset: request.page * 9
      });
    },
  });


  showFavoritesPopup = signal(false);

  favoritesCount = computed(() => this.productsService.favorites().length);

  toggleFavoritesPopup(): void {
    this.showFavoritesPopup.update(value => !value);
  }

}
