export default class GasStationModel {
  port: string;
  typeOil: TypeOil[];
}

class TypeOil {
  name: string;
  trucks: string[];
}