import {Serialize, SerializeProperty, Serializable} from 'ts-serializer';
import {IntelliEventReason} from './intelli-event-reason.model';

@Serialize({})
export class IntelliEventReasonsResponse extends Serializable {
  @SerializeProperty({
    map: 'NextRealizeUrl'
  })
  nextRealizeURL: string;

  @SerializeProperty({
    map: 'Values',
    type: IntelliEventReason,
    list: true
  })
  reasons: IntelliEventReason[];

  public static fromJSON(jsonData: any): IntelliEventReasonsResponse {
    const newEventReasonsResponse = new IntelliEventReasonsResponse();
    newEventReasonsResponse.deserialize(jsonData);

    return newEventReasonsResponse;
  }
}
