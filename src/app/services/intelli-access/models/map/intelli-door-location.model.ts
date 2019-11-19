import {Serializable, Serialize, SerializeProperty} from 'ts-serializer';

@Serialize({})
export class IntelliDoorLocation extends Serializable {
  @SerializeProperty()
  css: string;

  @SerializeProperty()
  name: string;
}
