import {Serialize, SerializeProperty, Serializable} from 'ts-serializer';
import {IntelliEvent} from './intelli-event.model';

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

  public static fromJSON(jsonData: any): IntelliEventsResponse {
    const newEventsResponse = new IntelliEventsResponse();
    newEventsResponse.deserialize(jsonData);

    return newEventsResponse;
  }
}
