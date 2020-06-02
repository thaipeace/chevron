import {DefaultObject, TQLFormData} from '../default/default-object.model';
import * as _ from 'lodash';

export class DeviceModel extends DefaultObject {
  private static _dataKeys: TQLFormData = new TQLFormData(
    {
      'DeviceId': {
        type: 'string',
        editable: false,
        readonly: true,
        hidden: true
      },
      'DeviceName': {
        type: 'string',
        editable: true,
      },
      'MACAddress': {
        type: 'string',
        editable: true,
      },      
      'DefaultHomeURL': {
        type: 'string',
        editable: true,
      },
      'HomeURL': {
        type: 'string',
        editable: true,
      },
      'DeviceProtocol': {
        type: 'string',
        editable: true,
      },
      'Type': {
        type: 'string',
        editable: true,
      },
      'Location': {
        type: 'string',
        editable: true,
      },
      // not editable
      'CurrentState': {
        type: 'string',
        editable: false,
        readonly: true,
      },
      'Port': {
        type: 'string',
        editable: false,
        readonly: true,
      },
      'WorkURL': {
        type: 'string',
        editable: false,
        readonly: true,
      },
      'Host': {
        type: 'string',
        editable: false,
        readonly: true,
      },
      'HomeKey': {
        type: 'string',
        editable: false,
        readonly: true,
      },
      'HomeSecret': {
        type: 'string',
        editable: false,
        readonly: true,
      },
      'LastSeen': {
        type: 'string',
        editable: false,
        readonly: true,
      },
      
      'EnableAlarmConditions': {
        type: 'string',
        editable: false,
        readonly: true,
      },
      'CreatedAt': {
        type: 'string',
        editable: false,
        readonly: true,
      },
      'LastUpdated': {
        type: 'string',
        editable: false,
        readonly: true,
      },
    }
  );

  /*
  * <Find Status="Success">
  <Result>
    <Device>
      <DeviceId>M7ZXQ6RIAAAKYHYGSLZKCWWA</DeviceId>
      <MACAddress>02-05-4C-2B-96-E6</MACAddress>
      <HomeSecret>zsfsa</HomeSecret>
      <DeviceName>Test</DeviceName>
      <Location/>
      <HomeURL>http://18.221.199.94:9090/fid-dmConfigHttp</HomeURL>
      <certId/>
      <Type>Neuron</Type>
      <Port>8080</Port>
      <DefaultHomeURL>http://18.221.199.94:9090/fid-dmConfigHttp</DefaultHomeURL>
      <CreatedAt>2018-12-28T06:20:18.329Z</CreatedAt>
      <WorkURL/>
      <HomeKey>asdsaa</HomeKey>
      <Host>172.31.6.146</Host>
      <LastSeen>2018-12-31T02:08:00.393Z</LastSeen>
      <DeviceProtocol>MQTT</DeviceProtocol>
      <EnableAlarmConditions>true</EnableAlarmConditions>
      <LastUpdated>2018-12-31T02:08:00.410Z</LastUpdated>
      <CurrentState>TestReady</CurrentState>
    </Device>
  </Result>
</Find>
  * */
  constructor(_data = {}) {
    super(_data, 'DeviceId');
  }
}
