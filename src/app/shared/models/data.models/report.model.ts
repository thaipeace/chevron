import {DefaultObject} from '../default/default-object.model';

export class ReportModel extends DefaultObject {
  constructor(_data = {}) {
    super(_data, 'sysId');
  }
}
