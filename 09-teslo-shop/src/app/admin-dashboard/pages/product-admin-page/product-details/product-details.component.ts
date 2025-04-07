import { Component, inject, input, OnInit, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ProductCarouselComponent } from '@products/components/product-carousel/product-carousel.component';
import { Product } from '@products/interfaces/product.interface';
import { ProductsService } from '@products/services/products.service';
import { FormErrorLabelComponent } from '@shared/components/form-error-label/form-error-label.component';
import { FormUtils } from '@utils/form-utils';
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'product-details',
  imports: [
    ProductCarouselComponent,
    ReactiveFormsModule,
    FormErrorLabelComponent,
  ],
  templateUrl: './product-details.component.html',
  styles: ``,
})
export class ProductDetailsComponent implements OnInit {
  product = input.required<Product>();

  router = inject(Router);
  fb = inject(FormBuilder);

  productsService = inject(ProductsService);
  wasSaved = signal(false);

  productForm = this.fb.group({
    title: ['', [Validators.required]],
    description: ['', [Validators.required]],
    slug: [
      '',
      [Validators.required, Validators.pattern(FormUtils.slugPattern)],
    ],
    price: [0, [Validators.required, Validators.min(0)]],
    stock: [0, [Validators.required, Validators.min(0)]],
    sizes: [['']], //! Será un arreglo de strings
    images: [[]],
    tags: [''],
    gender: [
      'men',
      [Validators.required, Validators.pattern(/men|women|kid|unisex/)],
    ],
  });

  sizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];

  ngOnInit(): void {
    this.setFormValue(this.product());
  }

  //! Partial: indica que todas los valores pueden ser opcionales
  setFormValue(formLike: Partial<Product>) {
    //! Con 'reset' cambia todo el valor y reestablece a su estado "Pristine"
    this.productForm.reset(this.product() as any);
    this.productForm.patchValue({ tags: formLike.tags?.join(',') });
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
    this.productForm.markAllAsTouched();

    if (!isValid) return;
    const formValue = this.productForm.value;

    const productLike: Partial<Product> = {
      ...(formValue as any),
      tags:
        formValue.tags
          ?.toLowerCase()
          .split(',')
          .map((tag) => tag.trim()) ?? [],
    };

    if (this.product().id === 'new') {
      // Crear producto
      //! firstValueFrom: básicamente recibe un Observable y devuelve una promesa cuando tenemos ese valor. No hace falta poner el .subscribe porque 'firstValueFrom' automáticamente hace la subscripción
      const product = await firstValueFrom(
        this.productsService.createProduct(productLike)
      );
      this.router.navigate(['/admin/product', product.id]);

      //! Antes de utilizar el firstValueFrom
      // this.productsService.createProduct(productLike).subscribe((product) => {
      //   console.log('Producto creado');
      //   this.router.navigate(['/admin/product', product.id]);
      // });
    } else {
      await firstValueFrom(
        this.productsService.updateProduct(this.product().id, productLike)
      );

      //! Antes de utilizar el firstValueFrom
      // this.productsService
      //   .updateProduct(this.product().id, productLike)
      //   .subscribe((product) => {
      //     console.log('Producto actualizado');
      //   });
    }

    this.wasSaved.set(true);

    setTimeout(() => {
      this.wasSaved.set(false);
    }, 3000);
  }
}
