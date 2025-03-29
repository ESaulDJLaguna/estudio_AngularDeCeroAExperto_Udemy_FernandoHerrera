import { Component, inject } from '@angular/core';
import { rxResource, toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute } from '@angular/router';
import { ProductsService } from '@products/services/products.service';
import { map } from 'rxjs';
import { ProductCardComponent } from '../../../products/components/product-card/product-card.component';
import { I18nSelectPipe } from '@angular/common';

@Component({
  selector: 'app-gender-page',
  imports: [ProductCardComponent, I18nSelectPipe],
  templateUrl: './gender-page.component.html',
  styles: ``,
})
export class GenderPageComponent {
  productsService = inject(ProductsService);
  activatedRoute = inject(ActivatedRoute);

  genderMap = {
    men: 'Hombres',
    women: 'Mujeres',
    kid: 'Niños',
  };

  gender = toSignal(
    this.activatedRoute.params.pipe(map(({ gender }) => gender))
  );

  productsResource = rxResource({
    request: () => ({ gender: this.gender() }),
    loader: ({ request }) => {
      return this.productsService.getProducts({
        gender: request.gender,
      });
    },
  });
}
