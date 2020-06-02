import { UMDefaultObject, TQLFormData } from '../default/default-object.model';

export class DPMOdel extends UMDefaultObject {
  private static _dataKeys: TQLFormData = new TQLFormData(
    {}
  );

  image: string;

  constructor(_data = {}) {
    super();
    this.image = this.getValue('image');
  }
}
