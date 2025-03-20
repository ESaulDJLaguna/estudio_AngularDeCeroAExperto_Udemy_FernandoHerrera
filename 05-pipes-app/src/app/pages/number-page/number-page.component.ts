import { CurrencyPipe, DecimalPipe, PercentPipe } from '@angular/common';
import { Component, signal } from '@angular/core';

@Component({
  selector: 'app-number-page',
  imports: [DecimalPipe, PercentPipe, CurrencyPipe],
  templateUrl: './number-page.component.html',
})
export default class NumberPageComponent {
  //! En JavaScript se pueden separar los miles con guion bajo
  totalSells = signal(2_233_232.5567);
  percent = signal(0.4856);
}
