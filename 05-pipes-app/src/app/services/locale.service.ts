import { Injectable, signal } from '@angular/core';

export type AvailableLocale = 'es' | 'fr' | 'en';
const LOCALE_KEY = 'locale';

//! Inyectamos el servicio en app.config.ts para establecer el idioma local de la aplicación
@Injectable({ providedIn: 'root' })
export class LocaleService {
  private currentLocale = signal<AvailableLocale>('fr');

  constructor() {
    this.currentLocale.set(
      (localStorage.getItem(LOCALE_KEY) as AvailableLocale) ?? 'es'
    );
  }

  get getLocale() {
    return this.currentLocale();
  }

  changeLocale(locale: AvailableLocale) {
    localStorage.setItem(LOCALE_KEY, locale);
    this.currentLocale.set(locale);
    //! Cuando se va a configurar un nuevo local desde el app.config.ts Angular requiere que se recargue la aplicación
    window.location.reload();
  }
}
