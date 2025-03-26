import {
  AfterViewInit,
  Component,
  effect,
  ElementRef,
  signal,
  viewChild,
} from '@angular/core';
import mapboxgl from 'mapbox-gl'; // or "const mapboxgl = require('mapbox-gl');"
import { environment } from '../../../environments/environment';
import { DecimalPipe, JsonPipe } from '@angular/common';

mapboxgl.accessToken = environment.mapboxKey;

@Component({
  selector: 'app-fullscreen-map-page',
  imports: [DecimalPipe, JsonPipe],
  templateUrl: './fullscreen-map-page.component.html',
  styles: `
    div {
      width: 100vw;
      height: calc(100vh - 64px);
    }

    #controls {
      background-color: white;
      padding: 10px;
      border-radius: 5px;
      position: fixed;
      bottom: 25px;
      right: 20px;
      z-index: 9999;
      box-shadow: 0 0 10px 0 rgba(0, 0, 0, 0.1);
      border: 1px solid #e2e8f0;
      whidth: 250px;
    }
  `,
})
export class FullscreenMapPageComponent implements AfterViewInit {
  //! Buscamos por la referencia local #map (no se usa el #)
  divElement = viewChild<ElementRef>('map');
  map = signal<mapboxgl.Map | null>(null);

  zoom = signal(14);
  coordinates = signal({
    lng: -74.5,
    lat: 40,
  });

  zoomEffect = effect(() => {
    if (!this.map()) return;

    this.map()?.setZoom(this.zoom());
    //! zoomTo genera una animación cada vez que cambia el zoom
    // this.map()?.zoomTo(this.zoom());
  });

  async ngAfterViewInit() {
    if (!this.divElement()?.nativeElement) return;

    /*
    ! En caso de que el mapa no se estire a todo el tamaño esperado, posiblemente sea porque sucede demasiado rápido y el elemento todavía no tiene la dimensión correcta, por eso se hace un pequeño delay para esperar unas milésimas de segundo a que el elemento esté construido
    */
    await new Promise((resolve) => setTimeout(resolve, 80));

    const element = this.divElement()!.nativeElement;
    const { lat, lng } = this.coordinates();

    // console.log(element);

    const map = new mapboxgl.Map({
      container: element, // container ID
      style: 'mapbox://styles/mapbox/streets-v12', // style URL
      center: [lng, lat], // starting position [lng, lat]
      zoom: this.zoom(), // starting zoom
    });

    this.mapListeners(map);
  }

  mapListeners(map: mapboxgl.Map) {
    /*
    ! Existen varios métodos que se pueden estar escuchando, en este caso se usará 'zoomend', "Después de que se haga el zoom". Una vez termina, se ejecuta el (event).

    ! Con esto se está creando un listener en el mapa para que cada vez que el valor del zoom cambie, me sea notificado y con esa notificación se cambie la señal.
    */
    map.on('zoomend', (event) => {
      const newZoom = event.target.getZoom();
      this.zoom.set(newZoom);
    });

    /*
    ! Cuando el mapa termine de moverse. El centro del mapa se podría obtener del evento `map.on('moveend', (event) => {})`, pero se mostrará otra forma de hacerlo
    */
    map.on('moveend', () => {
      const center = map.getCenter();
      // console.log({ center });
      this.coordinates.set(center);
    });

    /*
    ! Con `on()` añadimos cualquier listener a un evento.

    ! load: cuando el mapa está cargado.
    */
    // map.on('load', () => {});

    //! Con `addControl()` se pueden agregar ciertos controles
    map.addControl(new mapboxgl.FullscreenControl());
    map.addControl(new mapboxgl.NavigationControl());
    map.addControl(new mapboxgl.ScaleControl());

    this.map.set(map);
  }
}
