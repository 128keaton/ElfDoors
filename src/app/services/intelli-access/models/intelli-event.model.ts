import {Serializable, Serialize, SerializeProperty} from 'ts-serializer';

@Serialize({})
export class IntelliEvent extends Serializable {
  @SerializeProperty({
    map: 'Id'
  })
  id: number;

  @SerializeProperty({
    map: 'Who'
  })
  triggeredByName: string;

  @SerializeProperty({
    map: 'Reason'
  })
  triggeredReason: string;

  @SerializeProperty({
    map: 'Door'
  })
  doorName: string;

  @SerializeProperty({
    map: 'DoorId'
  })
  doorID: number;

  @SerializeProperty({
    map: 'CreatedUTC',
  })
  triggeredAt: string;
}
