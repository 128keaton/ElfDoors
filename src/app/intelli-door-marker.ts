import {DivIcon, Marker, MarkerOptions, Map, LatLng} from 'leaflet';
import {IntelliDoor} from './services/intelli-access/models/doors/intelli-door.model';
import {Observable} from 'rxjs';


export class DoorMarker extends Marker {
  public readonly door: IntelliDoor;
  public doorName: string;

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
                <div class="status"></div>
                <h1 class="name">${this.doorName}</h1>
            </div>`;
  }

  constructor(door: IntelliDoor, coordinates: LatLng, options: MarkerOptions = null) {
    super(coordinates, options);
    this.door = door;
    this.doorName = this.door.name;
    this.options.icon = this.icon;
  }

  onAdd(map: Map): this {
    super.onAdd(map);
    return this;
  }
}
