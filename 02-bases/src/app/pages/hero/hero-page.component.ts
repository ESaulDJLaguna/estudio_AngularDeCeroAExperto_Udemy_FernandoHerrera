import { CommonModule } from '@angular/common';
import { Component, computed, signal } from '@angular/core';

@Component({
  templateUrl: './hero-page.component.html',
  imports: [CommonModule],
  standalone: true,
})
export class HeroPageComponent {
  name = signal('Ironman');
  age = signal(45);

  //! Cuando una dependencia de una señal computada cambia, la señal se vuelve a computar (cambia).
  heroDescription = computed(() => {
    const description = `${this.name()} - ${this.age()}`;
    return description;
  });
  capitalizeName = computed(() => this.name().toUpperCase());

  getHeroDescription() {
    return `${this.name()} - ${this.age()}`;
  }

  changeHero() {
    this.name.set('Spiderman');
    this.age.set(22);
  }

  resetForm() {
    this.name.set('Ironman');
    this.age.set(45);
  }

  changeAge() {
    this.age.set(60);
  }
}
