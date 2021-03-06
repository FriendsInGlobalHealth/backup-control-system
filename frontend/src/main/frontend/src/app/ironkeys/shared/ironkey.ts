import { User } from '../../users/shared/user';
import { District } from '../../districts/shared/district';

/**
 * @author Damasceno Lopes <damascenolopess@gmail.com>
 */
export class Ironkey {
  ironkeyId: number;
  serial: string;
  size: number;
  version: string;
  status: string;
  observation: string;
  uid: string;
  districts: District[] = []
  createdBy: User = new User();
  updatedBy: User = new User();
  dateCreated: Date;
  dateUpdated: Date;
  datePurchased: Date;
  canceledBy: string;
}
