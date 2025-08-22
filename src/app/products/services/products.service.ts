import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { Gender, Product, ProductsResponse } from '../interfaces/product.interface';
import { delay, Observable, of, tap, map, forkJoin, switchMap } from 'rxjs';
import { environment } from 'src/environments/environment';
import { User } from '@/auth/interfaces/user.interface';

const baseUrl = environment.baseUrl;

interface Options {
  limit?: number;
  offset?: number;
  gender?: number;
}

const emptyProduct: Product = {
  id: 'new',
  title: '',
  price: 0,
  description: '',
  slug: '',
  stock: 0,
  sizes: [],
  gender: Gender.Men,
  tags: [],
  images: [],
  user: {} as User
}

@Injectable({ providedIn: 'root' })
export class ProductsService {
  private http = inject(HttpClient);
  public favorites = signal<Product[]>([])
  private productsCache = new Map<string, ProductsResponse>();
  private productCache = new Map<string, Product>();

  getProducts(options: Options): Observable<ProductsResponse> {

    const { limit = 9, offset = 0, gender = '' } = options;

    const key = `${limit}-${offset}-${gender}`;
    if (this.productsCache.has(key)) {
      return of(this.productsCache.get(key)!);


    }

    return this.http.get<ProductsResponse>(`${baseUrl}/products`, {
      params: {
        limit,
        offset,
        gender,
      },
    }).pipe(
      tap((response) => console.log(response)),
      tap((response) => this.productsCache.set(key, response)),
    );
  }

  getProductByIdSlug(idSlug: string): Observable<Product> {

    if (this.productCache.has(idSlug)) {
      return of(this.productCache.get(idSlug)!);
    }

    return this.http.get<Product>(`${baseUrl}/products/${idSlug}`).pipe(
      delay(1500),
      tap((product) => this.productCache.set(idSlug, product)),
    )
  }


  getProductById(id: string): Observable<Product> {

    if (id === 'new') {
      return of(emptyProduct);
    }

    if (this.productCache.has(id)) {
      return of(this.productCache.get(id)!);
    }

    return this.http.get<Product>(`${baseUrl}/products/${id}`).pipe(
      delay(1500),
      tap((product) => this.productCache.set(id, product)),
    )
  }

  updateProduct(id: string, productLike: Partial<Product>, imageFileList?: FileList): Observable<Product> {

    const currentImages = productLike.images ?? [];

    return this.uploadImages(imageFileList)
      .pipe(
        map((imageNames) => ({
          ...productLike,
          images: [...currentImages, ...imageNames],
        })),
        switchMap((updatedProduct) => this.http.patch<Product>(`${baseUrl}/products/${id}`, updatedProduct)
        ),
        tap((product) => this.updateProductCache(product))
      );



    // return this.http.patch<Product>(`${baseUrl}/products/${id}`, productLike).pipe
    //   (tap((product) => this.updateProductCache(product)));
  }

  createProduct(productLike: Partial<Product>, imageFileList?: FileList): Observable<Product> {

    const currentImages = productLike.images ?? [];

    return this.uploadImages(imageFileList)
      .pipe(
        map((imageNames) => ({
          ...productLike,
          images: [...currentImages, ...imageNames],
        })),
        switchMap((updatedProduct) => this.http.post<Product>(`${baseUrl}/products/`, updatedProduct)
        ),
        tap((product) => this.updateProductCache(product))
      );

    // return this.http.post<Product>(`${baseUrl}/products`, productLike).pipe
    //   (tap((product) => this.updateProductCache(product)));
  }

  deleteProduct(id: string): Observable<any> {
    return this.http.delete<Product>(`${baseUrl}/products/${id}`).pipe(
      tap(() => {
        this.productCache.delete(id);
        this.productsCache.clear();
      })
    );
  }

  clearFavorites() {
    this.favorites.set([]);
  }

  updateProductCache(product: Product) {
    const productId = product.id;

    this.productCache.set(productId, product);

    this.productsCache.forEach((productResponse) => {
      const productIndex = productResponse.products.findIndex((p) => p.id === productId)
      if (productIndex !== -1) {
        productResponse.products[productIndex] = product
      };
    });
  }

  uploadImages(images?: FileList): Observable<string[]> {
    if (!images) return of([]);

    const uploadObservables = Array.from(images).map(imageFile =>
      this.uploadImage(imageFile)
    );

    return forkJoin(uploadObservables).pipe(
      tap((imageNames) => console.log({ imageNames }))
    )
  }

  uploadImage(imageFile: File): Observable<string> {
    const formData = new FormData();
    formData.append('file', imageFile)

    return this.http.post<{ fileName: string }>(`${baseUrl}/files/product`, formData)
      .pipe(
        map((resp) => resp.fileName)
      )
  }

  toggleFavorite(product: Product): void {
    const currentFavorites = this.favorites()
    const isFavorite = currentFavorites.some(p => p.id === product.id);

    if (isFavorite) {
      this.favorites.set(currentFavorites.filter(p => p.id !== product.id));
    } else {
      this.favorites.update(favs => [...favs, product]);
    }
  }

}
