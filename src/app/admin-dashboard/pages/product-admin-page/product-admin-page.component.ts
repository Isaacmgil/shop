import { ProductsService } from '@/products/services/products.service';
import { Component, effect, inject, signal } from '@angular/core';
import { rxResource, toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute, Router } from '@angular/router';
import { map } from 'rxjs';


@Component({
  selector: 'app-product-admin-page',
  imports: [],
  templateUrl: './product-admin-page.component.html',
})
export class ProductAdminPageComponent {

  ActivatedRoute = inject(ActivatedRoute);
  router = inject(Router);
  productService = inject(ProductsService);

productId = toSignal(
  this.ActivatedRoute.params.pipe(
    map(params => params['id'])),
  );

  productResource = rxResource({
    request: () => ({id: this.productId()}),
    loader: ({ request }) => {
      return this.productService.getProductById(request.id);
    }
  });

  redirectEffect = effect(() => {
    if (this.productResource.error()) {
      this.router.navigate(['/admin/products']);
    }
  })

}
