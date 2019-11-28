import {DivIcon, Marker, MarkerOptions, Map, LatLng} from 'leaflet';
import {IntelliDoor} from '../services/intelli-access/models/doors/intelli-door.model';
import {IntelliDoorStatus} from '../services/intelli-access/models/status/intelli-door-status.enum';


export class DoorMarker extends Marker {
  public readonly door: IntelliDoor;
  public doorName: string;
  public doorStatus: IntelliDoorStatus;

  private iconWidth = 100;
  private iconHeight = 25;

  private get icon(): DivIcon {
    return new DivIcon({
      className: 'door-marker',
      html: this.iconHTML,
      iconSize: [this.iconWidth, this.iconHeight]
    });
  }

  private get iconHTML(): string {
    return `
                <div class="status ${this.statusClass}"></div>
                <h1 class="name">${this.doorName}</h1>
            `;
  }

  constructor(door: IntelliDoor, coordinates: LatLng, options: MarkerOptions = null) {
    super(coordinates, options);
    this.door = door;
    this.doorName = this.door.name;
    this.doorStatus = this.door.status;
    this.options.icon = this.icon;
  }

  get statusClass(): string {
    switch (this.doorStatus) {
      case IntelliDoorStatus.close:
        return 'status-closed';
      case IntelliDoorStatus.open:
        return 'status-open';
      case IntelliDoorStatus.forcedOpen:
        return 'status-forced-open';
      case IntelliDoorStatus.heldOpen:
        return 'status-held-open';
    }
  }

  onAdd(map: Map): this {
    super.onAdd(map);
    return this;
  }
}
