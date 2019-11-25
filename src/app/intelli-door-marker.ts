import {DivIcon, Marker, MarkerOptions, Map, LatLng, ImageOverlay, LatLngExpression, latLng} from 'leaflet';
import {IntelliDoorLocation} from './services/intelli-access/models/map/intelli-door-location.model';


export class DoorMarker extends Marker {
  public readonly door: IntelliDoorLocation;
  public readonly parentOverlay: ImageOverlay;

  private iconWidth = 22;
  private iconHeight = 22;

  private get icon(): DivIcon {
    return new DivIcon({
      className: 'door-marker',
      html: this.iconHTML,
      iconSize: [this.iconWidth, this.iconHeight]
    });
  }

  private get iconHTML(): string {
    return `<div class="door-marker">
<div class="door-status"></div>
<h1 class="door-name">${this.door.name}</h1>
</div>`;
  }

  constructor(door: IntelliDoorLocation, parentOverlay: ImageOverlay, options: MarkerOptions = null) {
    super(this.getCoords(door.x, door.y), options);
    this.door = door;
    this.parentOverlay = parentOverlay;
    this.options.icon = this.icon;
  }

  private getCoords(x: number, y: number): LatLng {
    if (!x && !y) {
      return latLng(this.randomPoints(this.parentOverlay));
    }

    return new LatLng(x, y);
  }

  onAdd(map: Map): this {
    super.onAdd(map);
    return this;
  }

  randomPoints(inLayer: ImageOverlay): LatLngExpression {
    const bounds = inLayer.getBounds();
    const xMin = bounds.getEast();
    const xMax = bounds.getWest();
    const yMin = bounds.getSouth();
    const yMax = bounds.getNorth();

    const lat = yMin + (Math.random() * (yMax - yMin));
    const lng = xMin + (Math.random() * (xMax - xMin));

    const inside = bounds.contains([lat, lng]);

    if (inside) {
      return [lat, lng];
    } else {
      return this.randomPoints(inLayer);
    }
  }
}
