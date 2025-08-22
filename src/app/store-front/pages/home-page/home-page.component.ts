import { ProductCardComponent } from '@/products/components/product-card/product-card.component';
import { Component, computed, inject, signal } from '@angular/core';
import { ProductsService } from '@/products/services/products.service';
import { rxResource, toSignal } from '@angular/core/rxjs-interop';
import { PaginationComponent } from "@/shared/components/pagination/pagination.component";
import { PaginationService } from '@/shared/components/pagination/pagination.service';
import { RouterLink } from '@angular/router';
import { ProductImagePipe } from '@/products/pipes/product-image-pipe';

@Component({
  selector: 'app-home-page',
  imports: [ProductCardComponent, PaginationComponent, RouterLink, ProductImagePipe],
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
    request: () => ({page: this.paginationService.currentPage() - 1}),
    loader: ({request}) => {

      return this.productsService.getProducts({
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


