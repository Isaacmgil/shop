import { Product } from '@/products/interfaces/product.interface';
import { Component, computed, inject, input, signal } from '@angular/core';
import { ProductCarouselComponent } from "@/products/components/product-carousel/product-carousel.component";
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { FormUtils } from '@/form-utils';
import { FormErrorLabelComponent } from "@/shared/components/form-error-label/form-error-label.component";
import { ProductsService } from '../../../../products/services/products.service';
import { Router } from '@angular/router';
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'app-product-details',
  imports: [ProductCarouselComponent, ReactiveFormsModule, FormErrorLabelComponent],
  templateUrl: './product-details.component.html',
})
export class ProductDetailsComponent {
  product = input.required<Product>();
  productsService = inject(ProductsService);
  router = inject(Router);
  productCreated = signal(false);

  imageFileList: FileList|undefined = undefined;
  tempImages = signal<string[]>([]);

  imagesToCarousel = computed(() => {
    const currentProductImages = [...this.product().images, ...this.tempImages(),];

    return currentProductImages;
  })

  formBuilder = inject(FormBuilder);

  productForm = this.formBuilder.group({
    title: ['', Validators.required],
    description: ['', Validators.required],
    slug: ['', [Validators.required, Validators.pattern(FormUtils.slugPattern)]],
    price: [0, [Validators.required, Validators.min(0)]],
    stock: [0, [Validators.required, Validators.min(0)]],
    sizes: [['']],
    images: [[]],
    tags: [''],
    gender: ['', [Validators.required, Validators.pattern('men|women|kid|unisex')]]


  });


  sizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];

  ngOnInit(): void {
    this.setFormValue(this.product())
  }

  setFormValue(formLike: Partial<Product>) {
    this.productForm.reset(this.product() as any)
    this.productForm.patchValue({ tags: formLike.tags?.join(', ') });
    // this.productForm.patchValue(formLike as any);
  }

  onSizeClicked(size: string) {
    const currentSizes = this.productForm.value.sizes ?? [];
    if (currentSizes.includes(size)) {
      currentSizes.splice(currentSizes.indexOf(size), 1);
    } else {
      currentSizes.push(size);
    }

    this.productForm.patchValue({ sizes: currentSizes });
  }


  async onSubmit() {
    const isValid = this.productForm.valid;
    this.productForm.markAllAsTouched

    if (!isValid) return

    const formValue = this.productForm.value;

    const productLike: Partial<Product> = {
      ...(formValue as any),
      tags: formValue.tags?.toLowerCase().split(',').map((tag) => tag.trim()) ?? [],
    };

    if (this.product().id === 'new') {
      const product = await firstValueFrom(
        this.productsService.createProduct(productLike, this.imageFileList)
      );

      this.router.navigate(['/admin/products', product.id]);

    } else {
      await firstValueFrom(
        this.productsService.updateProduct(this.product().id, productLike, this.imageFileList)
      )
    }

    this.productCreated.set(true);
    setTimeout(() => {
      this.productCreated.set(false)
    }, 3000);
  }

  async onDeleteProduct() {
    const productId = this.product().id;

    if (productId === 'new') {
      console.warn('No se puede eliminar un producto que aún no ha sido creado.');
      return;
    }

    const confirmed = window.confirm(`¿Estás seguro de que quieres eliminar "${this.product().title}"?`);

    if (!confirmed) {
      return;
    }

    try {
      this.productsService.deleteProduct(productId);
      console.log('Producto eliminado con éxito.');

      this.router.navigate(['/admin/products']);

    } catch (error) {
      console.error('Ocurrió un error al eliminar el producto:', error);
    }
  }

  onFilesChanged(event: Event) {
    const filelist = (event.target as HTMLInputElement).files;
    this.imageFileList = filelist ?? undefined;

    const imageUrls = Array.from(filelist ?? []).map(
      file => URL.createObjectURL(file)
    );

    this.tempImages.set(imageUrls);
  }


}

