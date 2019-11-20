import {Serializable, Serialize, SerializeProperty} from 'ts-serializer';

@Serialize({})
export class IntelliDoorLocation extends Serializable {
  @SerializeProperty()
  name: string;

  @SerializeProperty()
  x: number;

  @SerializeProperty()
  y: number;
}
