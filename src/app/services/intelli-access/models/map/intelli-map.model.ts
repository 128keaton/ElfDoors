import {Serializable, Serialize, SerializeProperty} from 'ts-serializer';
import {IntelliDoorLocation} from './intelli-door-location.model';

@Serialize({})
export class IntelliMap extends Serializable {
  @SerializeProperty({
    list: true,
    type: IntelliDoorLocation
  })
  doors: IntelliDoorLocation[];
}
