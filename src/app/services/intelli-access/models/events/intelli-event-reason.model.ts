import {Serializable, Serialize, SerializeProperty} from 'ts-serializer';

@Serialize({})
export class IntelliEventReason extends Serializable {
  @SerializeProperty({
    map: 'Id'
  })
  id: number;

  @SerializeProperty({
    map: 'Name'
  })
  name: string;

  @SerializeProperty({
    map: 'DisplayName',
  })
  displayName: string;
}
