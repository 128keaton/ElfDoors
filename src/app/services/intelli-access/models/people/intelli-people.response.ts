import {Serialize, SerializeProperty, Serializable} from 'ts-serializer';
import {IntelliPerson} from './intelli-person.model';

@Serialize({})
export class IntelliPeopleResponse extends Serializable {
  @SerializeProperty({
    map: 'Items',
    type: IntelliPerson,
    list: true
  })
  people: IntelliPerson[];

  public static fromJSON(jsonData: any): IntelliPeopleResponse {
    const newPeopleResponse = new IntelliPeopleResponse();
    newPeopleResponse.deserialize(jsonData);

    return newPeopleResponse;
  }
}
