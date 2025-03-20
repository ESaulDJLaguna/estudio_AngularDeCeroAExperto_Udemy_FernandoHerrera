import {
  DatePipe,
  LowerCasePipe,
  TitleCasePipe,
  UpperCasePipe,
} from '@angular/common';
import { Component, effect, inject, LOCALE_ID, signal } from '@angular/core';
import { AvailableLocale, LocaleService } from '../../services/locale.service';

@Component({
  selector: 'app-basic-page',
  imports: [LowerCasePipe, UpperCasePipe, TitleCasePipe, DatePipe],
  templateUrl: './basic-page.component.html',
})
export default class BasicPageComponent {
  localeService = inject(LocaleService);
  //! Lo ideal es que el currentLocale se tomara del servicio, pero se muestra que también podemos tomarlo de LOCALE_ID
  currentLocale = signal(inject(LOCALE_ID));

  nameLower = signal('erik saul');
  nameUpper = signal('ERIK SAUL');
  fullName = signal('eRiK sAUl');

  customDate = signal(new Date());

  tickingDateEffect = effect((onCleanup) => {
    /*
    ! Hay que tener mucho cuidado al utilizar un setInterval porque Angular no va a saber automáticamente en qué momento va a hacer la limpieza.

    ! Si no se limpia el intervalo, segurá existiendo en background y cuando se vuelva a entrar a la pantalla será n veces más rápido (dependiendo cuantas veces se vuelva a entrar).

    ! Por eso cuando ya no se vaya a necesitar este efecto, se tiene que hacer la limpieza del intervalo, esto se hace con onCleanup (o el nombre de la función que nosotros querramos)
    */
    const interval = setInterval(() => {
      this.customDate.set(new Date());
      console.log('tick');
    }, 1000);

    onCleanup(() => {
      //! Función que se ejecutará cuando se destruya el efecto */
      clearInterval(interval);
    });
  });

  changeLocale(locale: AvailableLocale) {
    console.log({ locale });
    this.localeService.changeLocale(locale);
  }
}
