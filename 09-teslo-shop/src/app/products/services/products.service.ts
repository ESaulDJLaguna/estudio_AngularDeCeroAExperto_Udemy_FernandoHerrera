import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { User } from '@auth/interfaces/user.interface';
import {
  Gender,
  Product,
  ProductsResponse,
} from '@products/interfaces/product.interface';
import {
  catchError,
  delay,
  forkJoin,
  map,
  Observable,
  of,
  switchMap,
  tap,
} from 'rxjs';
import { environment } from 'src/environments/environment';

const BASE_URL = environment.baseUrl;

interface Options {
  limit?: number;
  offset?: number;
  gender?: string;
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
  user: {} as User,
};

@Injectable({ providedIn: 'root' })
export class ProductsService {
  private http = inject(HttpClient);

  private productsCache = new Map<string, ProductsResponse>();
  private productCache = new Map<string, Product>();

  getProducts(options: Options): Observable<ProductsResponse> {
    const { limit = 9, offset = 0, gender = '' } = options;

    const key = `${limit}-${offset}-${gender}`; // 9-0-''
    if (this.productsCache.has(key)) {
      return of(this.productsCache.get(key)!);
    }

    return this.http
      .get<ProductsResponse>(`${BASE_URL}/products`, {
        params: { limit, offset, gender },
      })
      .pipe(
        tap((resp) => console.log(resp)),
        tap((resp) => this.productsCache.set(key, resp))
      );
  }

  getProductByIdSlug(idSlug: string): Observable<Product> {
    if (this.productCache.has(idSlug)) {
      return of(this.productCache.get(idSlug)!);
    }

    return this.http.get<Product>(`${BASE_URL}/products/${idSlug}`).pipe(
      tap((resp) => console.log(resp)),
      delay(1000),
      tap((product) => this.productCache.set(idSlug, product))
    );
  }

  getProductById(id: string): Observable<Product> {
    if (id === 'new') {
      return of(emptyProduct);
    }

    if (this.productCache.has(id)) {
      return of(this.productCache.get(id)!);
    }

    return this.http
      .get<Product>(`${BASE_URL}/products/${id}`)
      .pipe(tap((product) => this.productCache.set(id, product)));
  }

  updateProduct(
    id: string,
    productLike: Partial<Product>,
    imageFileList?: FileList
  ): Observable<Product> {
    /*
    ! En rxjs tenemos lo que se conoce como "encadenamiento de Observables", es decir, se ejecuta un primer Observable y cuando se termina, se ejecuta un segundo y cuando se termina, se ejecuta el siguiente y de esa forma, podemos ejecutar Observables en secuencia. Y podemos tomar el resultado anterior y pasárselo al siguiente y así sucesivamente y a la vez poder disparar otros Observables que son totalmente ajenos al Observable inicial
    */
    const currentImages = productLike.images ?? [];

    return this.uploadImages(imageFileList).pipe(
      map((imagesNames) => ({
        ...productLike,
        images: [...currentImages, ...imagesNames],
      })),
      //! switchMap: toma el valor de un Observable anterior y generar otro Observable basado en el resultado anterior
      switchMap((updatedProduct) =>
        this.http.patch<Product>(`${BASE_URL}/products/${id}`, updatedProduct)
      ),
      tap((product) => this.updateProductCache(product))
    );
    // return this.http
    //   .patch<Product>(`${BASE_URL}/products/${id}`, productLike)
    //   .pipe(tap((product) => this.updateProductCache(product)));
  }

  createProduct(
    productLike: Partial<Product>,
    imageFileList?: FileList
  ): Observable<Product> {
    const currentImages = productLike.images ?? [];

    return this.uploadImages(imageFileList).pipe(
      map((imagesNames) => ({
        ...productLike,
        images: [...currentImages, ...imagesNames],
      })),
      switchMap((createdProduct) =>
        this.http.post<Product>(`${BASE_URL}/products`, createdProduct)
      ),
      tap((product) => this.updateProductCache(product))
    );

    // return this.http
    //   .post<Product>(`${BASE_URL}/products`, productLike)
    //   .pipe(tap((product) => this.updateProductCache(product)));
  }

  updateProductCache(product: Product) {
    const productId = product.id;

    this.productCache.set(productId, product);

    this.productsCache.forEach((productResponse) => {
      productResponse.products = productResponse.products.map(
        (currentProduct) =>
          currentProduct.id === productId ? product : currentProduct
      );
    });
  }

  //! Tome un FileList y lo suba
  uploadImages(images?: FileList): Observable<string[]> {
    if (!images) return of([]);

    const uploadObservables = Array.from(images).map((imageFile) =>
      this.uploadImage(imageFile)
    );

    //! forkJoin: se le envía un arreglo de Obesrvables y se va a esperar a que todos emitan de manera exitosa un valor. Si uno falla, lanza toda la excepción
    return forkJoin(uploadObservables).pipe(
      tap((imageNames) => console.log({ imageNames }))
    );
  }

  uploadImage(imageFile: File): Observable<string> {
    const formData = new FormData();
    formData.append('file', imageFile);

    return this.http
      .post<{ fileName: string }>(`${BASE_URL}/files/product`, formData)
      .pipe(map((resp) => resp.fileName));
  }
}
