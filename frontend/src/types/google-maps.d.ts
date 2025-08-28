/// <reference types="google.maps" />

declare global {
  namespace google {
    namespace maps {
      class Map {
        constructor(mapDiv: Element | null, opts?: MapOptions);
        setCenter(latLng: LatLng | LatLngLiteral): void;
        setZoom(zoom: number): void;
        panTo(latLng: LatLng | LatLngLiteral): void;
        setOptions(options: MapOptions): void;
        get(key: string): any;
        set(key: string, value: any): void;
      }

      class Marker {
        constructor(opts?: MarkerOptions);
        setMap(map: Map | null): void;
        setPosition(latLng: LatLng | LatLngLiteral): void;
        setAnimation(animation: Animation | null): void;
        setIcon(icon: Icon | string | null): void;
        addListener(eventName: string, handler: Function): MapsEventListener;
        setTitle(title: string): void;
      }

      class InfoWindow {
        constructor(opts?: InfoWindowOptions);
        open(options: InfoWindowOpenOptions): void;
        close(): void;
        setContent(content: string | Element): void;
      }

      interface MapOptions {
        center?: LatLng | LatLngLiteral;
        zoom?: number;
        styles?: Array<any>;
        [key: string]: any;
      }

      interface MarkerOptions {
        position?: LatLng | LatLngLiteral;
        map?: Map;
        title?: string;
        icon?: Icon | string;
        animation?: Animation;
      }

      interface Icon {
        path?: SymbolPath | string;
        fillColor?: string;
        fillOpacity?: number;
        strokeColor?: string;
        strokeWeight?: number;
        scale?: number;
      }

      interface InfoWindowOptions {
        content?: string | Element;
        position?: LatLng | LatLngLiteral;
      }

      interface InfoWindowOpenOptions {
        anchor?: Marker;
        map?: Map;
      }

      interface LatLngLiteral {
        lat: number;
        lng: number;
      }

      class LatLng {
        constructor(lat: number, lng: number, noWrap?: boolean);
        lat(): number;
        lng(): number;
        toString(): string;
        toJSON(): LatLngLiteral;
      }

      enum SymbolPath {
        CIRCLE,
        BACKWARD_CLOSED_ARROW,
        FORWARD_CLOSED_ARROW,
        BACKWARD_OPEN_ARROW,
        FORWARD_OPEN_ARROW,
      }

      enum Animation {
        BOUNCE,
        DROP,
      }

      interface MapsEventListener {
        remove(): void;
      }
    }
  }
}

export {};
