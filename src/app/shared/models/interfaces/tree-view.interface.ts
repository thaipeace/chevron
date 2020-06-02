import {CustomerModel} from '../data.models/customer/customer.model';
import {StationModel} from '../data.models/station/station.model';
import {TankModel} from '../data.models/tank/tank.model';
import { TruckModel } from '../data.models/fleet/truck.model';
import { DriverModel } from '../data.models/fleet/driver.model';
import { TruckCompanyModel } from '../data.models/fleet/truck-company.model';

export interface ITreeNode {
  name: string;
  children?: ITreeNode[];
}

export interface ICustomerTreeNode {
  nodeId: string;
  name: string;
  levelName: string;
  icon?: string;
  nodeData: CustomerModel | StationModel | TankModel;
  children?: ICustomerTreeNode[];
  isChildrenLoaded: boolean;
  customerName: string;
  stationName?: string;
  tankNumber?: string;
  parent?: ICustomerTreeNode;
}

export interface IFleetCompanyTreeNode {
  nodeId: string;
  name: string;
  levelName: string;
  icon?: string;
  nodeData: TruckCompanyModel | TruckModel | DriverModel;
  children?: IFleetCompanyTreeNode[];
  isChildrenLoaded: boolean;
  companyName: string;
  truckPlate?: string;
  driverName?: string;
  parent?: IFleetCompanyTreeNode;
}
