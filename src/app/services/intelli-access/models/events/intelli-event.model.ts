import {Serializable, Serialize, SerializeProperty} from 'ts-serializer';
import {IntelliEventReason} from './intelli-event-reason.model';

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
  rawTriggeredReason: string;

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

  triggeredReason: IntelliEventReason;
}
