import { Component } from '@angular/core';
import { HeavyLoadersSlowComponent } from '@shared/heavy-loaders/heavy-loaders-slow.component';
import { TitleComponent } from '@shared/title/title.component';

@Component({
  selector: 'app-defer-views',
  imports: [TitleComponent, HeavyLoadersSlowComponent],
  templateUrl: './defer-views.component.html',
  styles: ``,
})
export default class DeferViewsComponent {}
