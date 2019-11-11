import {Serializable, Serialize, SerializeProperty} from 'ts-serializer';
import {IntelliDoorControllerStatus} from '../status/intelli-door-controller-status.enum';
import {IntelliDoorLockStatus} from '../status/intelli-door-lock-status.enum';
import {IntelliDoorStatus} from '../status/intelli-door-status.enum';

@Serialize({})
export class IntelliDoor extends Serializable {
  @SerializeProperty({
    map: 'Id'
  })
  id: number;

  @SerializeProperty({
    map: 'Customer'
  })
  customer: string;

  @SerializeProperty({
    map: 'Door'
  })
  name: string;

  @SerializeProperty({
    map: 'ControllerStatus',
  })
  controllerStatus: IntelliDoorControllerStatus;

  @SerializeProperty({
    map: 'LockStatus'
  })
  lockStatus: IntelliDoorLockStatus;

  @SerializeProperty({
    map: 'DoorStatus'
  })
  status: IntelliDoorStatus;

  @SerializeProperty({
    map: 'BatteryStatus',
    optional: true
  })
  batteryStatus?: string;

  @SerializeProperty({
    map: 'InCameraId',
    optional: true
  })
  inCameraID?: number;

  @SerializeProperty({
    map: 'OutCameraId',
    optional: true
  })
  outCameraID?: number;

  @SerializeProperty({
    map: 'InZoneId',
    optional: true
  })
  inZoneID?: number;

  @SerializeProperty({
    map: 'OutZoneId',
    optional: true
  })
  outZoneID?: number;
}
