import {Directive, ElementRef, Input, OnInit} from '@angular/core';
import {IntelliDoor} from '../../services/intelli-access/models/doors/intelli-door.model';
import {IntelliDoorLocation} from '../../services/intelli-access/models/map/intelli-door-location.model';

// tslint:disable-next-line:directive-selector
@Directive({selector: '[positionedDoorDirective]'})
export class PositionedDoorDirective implements OnInit {
  @Input() door: IntelliDoor;

  constructor(private element: ElementRef) {
    console.log(element.nativeElement);
  }

  ngOnInit() {
  }

  @Input()
  set doorLocation(doorLocation: IntelliDoorLocation) {
    this.setStyle(doorLocation.css);
  }

  private setStyle(css: string) {
    const nativeElement: HTMLElement = this.element.nativeElement;
    if (css) {
      nativeElement.parentElement.style.position = 'absolute';
      nativeElement.parentElement.style.transform = css;
    } else {
      nativeElement.parentElement.style.removeProperty('position');
    }
  }
}


