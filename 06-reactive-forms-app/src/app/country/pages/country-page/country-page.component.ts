import { JsonPipe } from '@angular/common';
import { Component, effect, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { CountryService } from '../../services/country.service';
import { Country } from '../../interfaces/country.interface';
import { filter, switchMap, tap } from 'rxjs';

@Component({
  selector: 'app-country-page',
  imports: [JsonPipe, ReactiveFormsModule],
  templateUrl: './country-page.component.html',
})
export class CountryPageComponent {
  fb = inject(FormBuilder);
  countryService = inject(CountryService);

  regions = signal(this.countryService.regions);
  countriesByRegion = signal<Country[]>([]);
  borders = signal<Country[]>([]);

  myForm = this.fb.group({
    region: ['', [Validators.required]],
    country: ['', [Validators.required]],
    border: ['', [Validators.required]],
  });

  onFormChanged = effect((onCleanup) => {
    const regionSubscription = this.onRegionChanged();
    const countrySubscription = this.onCountryChange();

    onCleanup(() => {
      regionSubscription.unsubscribe();
      countrySubscription.unsubscribe();
      console.log('LIMPIADO');
    });
  });

  /*
  ! valueChanges es un Observable.

  ! Un inconveniente de subscribirse a los cambios del formulario (utilizando el 'valueChanges.subscribe'), es que se está creando una subscripción y aunque se cambie de pantalla y el componente se destruya, esta subscripción nunca se va a limpiar, aunque no se volverá a llamar porque se va a crear una nueva referencia a un objeto pero la subscripción seguirá existiendo. Por eso se utilizará un efecto y se hará uso de onCleanup, para que cuando se destruya el efecto se desuscriba del observable.
  */

  onRegionChanged() {
    return (
      this.myForm
        .get('region')!
        //!
        .valueChanges.pipe(
          tap(() => this.myForm.get('country')!.setValue('')),
          tap(() => this.myForm.get('border')!.setValue('')),
          tap(() => {
            this.borders.set([]);
            this.countriesByRegion.set([]);
          }),
          //! switchMap permite transformar el Observable anterior y regresar un Observable totalmente diferente
          switchMap((region) =>
            this.countryService.getCountriesByRegion(region!)
          )
        )
        .subscribe((countries) => {
          this.countriesByRegion.set(countries);
        })
    );
  }

  onCountryChange() {
    return this.myForm
      .get('country')!
      .valueChanges.pipe(
        tap(() => this.myForm.get('border')?.setValue('')),
        filter((value) => value!.length > 0),
        switchMap((alphaCode) =>
          this.countryService.getCountryByAlphaCode(alphaCode ?? '')
        ),
        switchMap((country) =>
          this.countryService.getCountryNamesByCodeArray(country.borders)
        )
      )
      .subscribe((borders) => {
        this.borders.set(borders);
      });
  }
}
