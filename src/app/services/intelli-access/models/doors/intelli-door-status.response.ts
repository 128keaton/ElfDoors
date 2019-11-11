import {Serialize, SerializeProperty, Serializable} from 'ts-serializer';
import {IntelliDoor} from './intelli-door.model';

@Serialize({})
export class IntelliDoorStatusResponse extends Serializable {
  @SerializeProperty({
    map: 'NextRealizeUrl'
  })
  nextRealizeURL: string;

  @SerializeProperty({
    map: 'Values',
    type: IntelliDoor,
    list: true
  })
  doors: IntelliDoor[];

  public static fromJSON(jsonData: any): IntelliDoorStatusResponse {
    const newDoorResponse = new IntelliDoorStatusResponse();
    newDoorResponse.deserialize(jsonData);

    return newDoorResponse;
  }
}
