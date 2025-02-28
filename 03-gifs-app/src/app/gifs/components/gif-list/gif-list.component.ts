import { Component, input } from '@angular/core';
import { GifListItemComponent } from './gifs-list-item/gif-list-item.component';

@Component({
  selector: 'gifs-list',
  imports: [GifListItemComponent],
  templateUrl: './gif-list.component.html',
})
export class GifListComponent {
  gifs = input.required<string[]>();
}
