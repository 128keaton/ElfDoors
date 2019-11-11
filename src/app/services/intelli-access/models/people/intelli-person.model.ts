import {Serializable, Serialize, SerializeProperty} from 'ts-serializer';

@Serialize({})
export class IntelliPerson extends Serializable {
  @SerializeProperty({
    map: 'Id'
  })
  id: number;

  @SerializeProperty({
    map: 'FirstName'
  })
  firstName: string;

  @SerializeProperty({
    map: 'LastName'
  })
  lastName: string;

  @SerializeProperty({
    map: 'CardNumber'
  })
  cardNumber: string;

  @SerializeProperty({
    map: 'CardStatus'
  })
  cardStatus: string;

  @SerializeProperty({
    map: 'IsCredentialHolder',
  })
  credentialHolder: boolean;

  get fullName(): string {
    return `${this.firstName} ${this.lastName}`;
  }
}
