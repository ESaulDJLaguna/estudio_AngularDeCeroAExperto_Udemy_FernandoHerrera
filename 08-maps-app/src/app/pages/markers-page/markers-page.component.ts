import {
  AfterViewInit,
  Component,
  ElementRef,
  signal,
  viewChild,
} from '@angular/core';
import mapboxgl, { LngLatLike } from 'mapbox-gl';
import { environment } from '../../../environments/environment';
import { v4 as UUIDv4 } from 'uuid';
import { JsonPipe } from '@angular/common';

mapboxgl.accessToken = environment.mapboxKey;

interface Marker {
  id: string;
  mapboxMarker: mapboxgl.Marker;
}

@Component({
  selector: 'app-markers-page',
  imports: [JsonPipe],
  templateUrl: './markers-page.component.html',
  styles: ``,
})
export class MarkersPageComponent implements AfterViewInit {
  divElement = viewChild<ElementRef>('map');
  map = signal<mapboxgl.Map | null>(null);
  markers = signal<Marker[]>([]);

  async ngAfterViewInit() {
    if (!this.divElement()?.nativeElement) return;

    await new Promise((resolve) => setTimeout(resolve, 80));

    const element = this.divElement()!.nativeElement;

    const map = new mapboxgl.Map({
      container: element, // container ID
      style: 'mapbox://styles/mapbox/streets-v12', // style URL
      center: [136.901795, 35.176582], // starting position [lng, lat]
      zoom: 14, // starting zoom
    });

    //! Creamos un marcador justo cuando se construye el mapa. Con addTo le indicamos a qué mapa queremos agregarlo (porque podríamos tener varios)
    // const marker = new mapboxgl.Marker({
    //   //! Permite mover o arrastar el marcador
    //   draggable: false,
    //   color: '000', //! Puede ser cualquier color: nombre ('red'), hex, rgb.
    // })
    //   .setLngLat([136.901795, 35.176582])
    //   .addTo(map);

    //! De igual forma, podemos poner listeners a los marcadores, de manera similar a como se agregan los listeners al map
    // marker.on('dragend', (event) => {
    //   console.log(event);
    // });

    this.mapListeners(map);
  }

  mapListeners(map: mapboxgl.Map) {
    //! Crearemos un listener cuando alguien haga clic en el mapa
    map.on('click', (event) => this.mapClick(event));

    this.map.set(map);
  }

  mapClick(event: mapboxgl.MapMouseEvent) {
    if (!this.map()) return;

    const map = this.map()!;
    const coords = event.lngLat;
    const color = '#xxxxxx'.replace(/x/g, (y) =>
      ((Math.random() * 16) | 0).toString(16)
    );
    // console.log(event.lngLat);

    const mapboxMarker = new mapboxgl.Marker({
      color: color,
    })
      .setLngLat(coords)
      .addTo(map);

    const newMarker: Marker = {
      id: UUIDv4(),
      mapboxMarker: mapboxMarker,
    };

    this.markers.set([newMarker, ...this.markers()]);
    // this.markers.update((previousMarkers) => [newMarker, ...this.markers()]);

    console.log(this.markers());
  }

  //! El tipo "LngLatLike" es un objeto que viene en "mapbox-gl" y es un objeto muy flexible, ya que acepta cualquier cosa que sea similar a la latitud o longitud (o algo que nos permita poder obtenerlas)
  flyToMarker(lngLat: LngLatLike) {
    if (!this.map()) return;

    this.map()!.flyTo({
      center: lngLat,
    });
  }

  //! Este marcador existe en el mapa y dentro del arreglo de señales, hay que eliminar en ambos lugares
  deleteMarker(marker: Marker) {
    if (!this.map()) return;

    const map = this.map()!;
    //! Al realizar esto, se elimina el marcador del mismo mapa
    marker.mapboxMarker.remove();

    // this.markers.set(this.markers().filter((m) => m.id !== marker.id));
    this.markers.update((currentMarker) =>
      this.markers().filter((m) => m.id !== marker.id)
    );
  }
}
