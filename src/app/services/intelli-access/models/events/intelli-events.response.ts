import {Serialize, SerializeProperty, Serializable} from 'ts-serializer';
import {IntelliEvent} from './intelli-event.model';
import {IntelliEventReason} from './intelli-event-reason.model';

@Serialize({})
export class IntelliEventsResponse extends Serializable {
  @SerializeProperty({
    map: 'NextRealizeUrl'
  })
  nextRealizeURL: string;

  @SerializeProperty({
    map: 'Values',
    type: IntelliEvent,
    list: true
  })
  events: IntelliEvent[];


  public static fromJSON(jsonData: any, reasons?: IntelliEventReason[]): IntelliEventsResponse {
    const newEventsResponse = new IntelliEventsResponse();
    newEventsResponse.deserialize(jsonData);

    if (reasons) {
      newEventsResponse.events.forEach(event => {
        event.triggeredReason = reasons.find(reason => reason.displayName === event.rawTriggeredReason);
      });
    }

    return newEventsResponse;
  }
}
