import { Product } from '@/products/interfaces/product.interface';
import { SlicePipe } from '@angular/common';
import { Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'product-card',
  imports: [RouterLink, SlicePipe],
  templateUrl: './product-card.component.html',
})
export class ProductCardComponent {

  product = input.required<Product>();


}
