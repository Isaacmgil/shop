import { ProductCardComponent } from '@/products/components/product-card/product-card.component';
import { Component, inject } from '@angular/core';
import { ProductsService } from '@/products/services/products.service';
import { rxResource } from '@angular/core/rxjs-interop';
import { PaginationComponent } from "@/shared/components/pagination/pagination.component";
import { PaginationService } from '@/shared/components/pagination/pagination.service';
import { ShoppingCartComponent } from "@/store-front/components/shopping-cart/shopping-cart.component";
import { FavoritesComponent } from "@/store-front/components/favorites/favorites.component";

@Component({
  selector: 'app-home-page',
  imports: [ProductCardComponent, PaginationComponent, ShoppingCartComponent, FavoritesComponent],
  templateUrl: './home-page.component.html',
})
export class HomePageComponent {

  productsService = inject(ProductsService);
  paginationService = inject(PaginationService);

  // activatedRoute = inject(ActivatedRoute);

  // currentPage = toSignal(
  //   this.activatedRoute.queryParamMap.pipe(
  //     map(params => (params.get('page') ? +params.get('page')! : 1)),map(page => (isNaN(page) ? 1 : page))
  // ), {
  //   initialValue: 1,
  // });

  productsResource = rxResource({
    request: () => ({ page: this.paginationService.currentPage() - 1 }),
    loader: ({ request }) => {

      return this.productsService.getProducts({
        offset: request.page * 9
      });
    },
  });

}


