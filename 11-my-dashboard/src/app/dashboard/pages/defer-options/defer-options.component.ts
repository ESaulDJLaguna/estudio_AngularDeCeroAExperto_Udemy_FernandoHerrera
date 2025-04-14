import { Component } from '@angular/core';
import { HeavyLoadersFastComponent } from '@shared/heavy-loaders/heavy-loaders-fast.component';
import { HeavyLoadersSlowComponent } from '@shared/heavy-loaders/heavy-loaders-slow.component';
import { TitleComponent } from '@shared/title/title.component';

@Component({
  selector: 'app-defer-options',
  imports: [
    HeavyLoadersFastComponent,
    TitleComponent,
    HeavyLoadersSlowComponent,
  ],
  templateUrl: './defer-options.component.html',
  styles: ``,
})
export default class DeferOptionsComponent {}
