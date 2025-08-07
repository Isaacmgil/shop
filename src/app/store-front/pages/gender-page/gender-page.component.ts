
import { ProductsService } from '@/products/services/products.service';
import { Component, inject } from '@angular/core';
import { rxResource, toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute } from '@angular/router';
import { map } from 'rxjs';
import { ProductCardComponent } from "@/products/components/product-card/product-card.component";

@Component({
  selector: 'gender-page',
  imports: [ProductCardComponent],
  templateUrl: './gender-page.component.html',
})

export class GenderPageComponent {

  route = inject(ActivatedRoute);
  gender = toSignal(
    this.route.params.pipe(
      map(({ gender }) => gender)
    )
  )

  productsService = inject(ProductsService);

  productsResource = rxResource({
    request: () => ({gender: this.gender()}),
    loader: ({ request }) => {

      return this.productsService.getProducts({
        gender: request.gender,
      });
    },
  });

}
