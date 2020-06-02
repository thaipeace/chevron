export const CustomerPayloadsConstant = {
  CUSTOMER: {
    OBJECT_FIND: 'CustomerStationUserMapping',
    GET_CUSTOMER_ACCESS: `
        <Query>
          <Find>
              <CustomerStationUserMapping>
                  <userName>{0}</userName>
              </CustomerStationUserMapping>
          </Find>
        </Query>
        `
  },
  CUSTOMER_STATION: {
    OBJECT_FIND: 'Station',
    OBJECT_STATIONCUSTOMER_FIND: 'CustomerStationUserMapping',
    GET_STATION_BY_STATION_ID: `
        <Query>
          <Find nested="1">
              <Station>
                  <sysId><in>{0}</in></sysId>
              </Station>
          </Find>
        </Query>
        `,
    GET_STATION_DETAIL_BY_USERNAME: `
        <Query>
          <Find  nested="1">
              <CustomerStationUserMapping  as="var.user">
                <userName>{0}</userName>
              </CustomerStationUserMapping>
              <Station>
                <sysId>var.user.stationId</sysId>
              </Station>
            </Find>
        </Query>
        `,
    GET_STATION_USERMAPPING:
      `
      <Query>
        <Find  nested="1">
          <CustomerStationUserMapping>
            <userName>{0}</userName>
          </CustomerStationUserMapping>
        </Find>
      </Query>
      `,
  },
};
