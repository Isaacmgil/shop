
import { ProductsService } from '@/products/services/products.service';
import { Component, computed, inject, signal } from '@angular/core';
import { rxResource, toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute } from '@angular/router';
import { map } from 'rxjs';
import { ProductCardComponent } from "@/products/components/product-card/product-card.component";
import { PaginationComponent } from '@/shared/components/pagination/pagination.component';
import { PaginationService } from '@/shared/components/pagination/pagination.service';
import { FavoritesComponent } from "@/store-front/components/favorites/favorites.component";
import { ShoppingCartComponent } from "@/store-front/components/shopping-cart/shopping-cart.component";

@Component({
  selector: 'gender-page',
  imports: [ProductCardComponent, PaginationComponent, FavoritesComponent, ShoppingCartComponent],
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

}
