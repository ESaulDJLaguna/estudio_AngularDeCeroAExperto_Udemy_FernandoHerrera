import { Pipe, PipeTransform } from '@angular/core';
import { environment } from 'src/environments/environment';

const BASE_URL = environment.baseUrl;

@Pipe({
  name: 'productImage',
})
export class ProductImagePipe implements PipeTransform {
  transform(value: null | string | string[]): string {
    if (value === null) {
      return 'assets/images/EfEkTSRVAAE5RdJ.jpg';
    }

    let urlImages = `${BASE_URL}/files/product`;

    if (typeof value === 'string') {
      if (value.startsWith('blob:')) {
        return value;
      }

      return `${urlImages}/${value}`;
    }

    const image = value.at(0);

    if (!image) {
      return 'assets/images/EfEkTSRVAAE5RdJ.jpg';
    }

    return `${urlImages}/${image}`;
  }
}
