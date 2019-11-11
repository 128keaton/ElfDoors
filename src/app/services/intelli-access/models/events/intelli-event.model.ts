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

  get isError(): boolean {
    if (this.triggeredReason) {
      return [44, 45, 76].includes(this.triggeredReason.id);
    }
    return false;
  }

  get isWarning(): boolean {
    if (this.triggeredReason) {
      return this.triggeredReason.id === 68;
    }
    return false;
  }
}
