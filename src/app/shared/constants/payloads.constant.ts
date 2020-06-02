export const PayloadsConstant = {
    TERMINAL: {
        OBJECT_FIND: 'Terminal',
        FIND_ALL: `
         <TerminalListData>
    </TerminalListData>
        `,
        FIND_BY_ID: ` <GetTerminalData>
      <terminalId>{0}</terminalId>
    </GetTerminalData>`,
        DELETE: `
    <DeleteTerminalData>
	<terminalId>{0}</terminalId>
</DeleteTerminalData>
    `,
        UPDATE: `
<UpdateTerminal>
	<terminalId>{0}</terminalId>
	{1}
	<geofencePoints>
		{2}
	</geofencePoints>
</UpdateTerminal>
    `,
        DELETE_GEO_POINTS: `
    <DeleteGeoFencePoint>
	<terminalId>{0}</terminalId>
</DeleteGeoFencePoint>
    `,
        createTerminalData: `<CreateTerminalData>
        <terminalName>{0}</terminalName>
        <description>{1}</description>
        <latitude>{2}</latitude>
        <longitude>{3}</longitude>
        <altitude>{4}</altitude>
    </CreateTerminalData>`
    },
    TRUCK_COMPANY: {
        OBJECT_FIND: 'TruckingCompany',
        FIND_ALL: `
        <Query>
            <Find>
                <TruckingCompany>
                    <sysid ne=""></sysid>
                </TruckingCompany>
            </Find>
        </Query>
        `,
        FIND_BY_ID: `
        <Query>
            <Find nested="*">
                <TruckingCompany>
                    <sysId>{0}</sysId>
                </TruckingCompany>
            </Find>
        </Query>
        `,
        NAME_EXISTS: `
        <Query>
        <Find nested="*">
                <TruckingCompany>
                    <companyName>{0}</companyName>
                </TruckingCompany>
            </Find>
        </Query>
        `,
        CREATE: `<Query>
            <Create>
                <TruckingCompany>
                <companyName>{companyName}</companyName>
                <contactPerson>{contactPerson}</contactPerson>
                <contactNumber>{contactNumber}</contactNumber>
                <companyCode>{companyCode}</companyCode>
                <companyId>{companyId}</companyId>
                <userName>{userName}</userName>
            </TruckingCompany>
            </Create>
        </Query>`,
        UPDATE: `<Query>
            <Save mode="unsafe">
            <TruckingCompany>
                <sysId>{sysId}</sysId>
                <companyCode>{companyCode}</companyCode>
                <contactNumber>{contactNumber}</contactNumber>
                <contactPerson>{contactPerson}</contactPerson>
                <userName>{userName}</userName>
            </TruckingCompany>
        </Save>
            </Query>`,
        DELETE: `
    <Query>
        <DeleteAll>
            <TruckingCompany>
                <Sysid eq="{sysId}"/>
                <userName>{userName}</userName>
            </TruckingCompany>
        </DeleteAll>
    </Query>
    `
    },
    TRUCK_COMPANY_USER: {
        OBJECT_FIND: 'userTruckingCompanyMapping',
        FIND_BY_USERNAME: `
      <Query>
          <Find>
              <userTruckingCompanyMapping>
                  <userName>{0}</userName>
              </userTruckingCompanyMapping>
          </Find>
      </Query>
        `,
        CREATE: `
    <Query>
        <Create>
            <userTruckingCompanyMapping>
                <userName>{userName}</userName>
                <truckCompanyId>{truckCompanyId}</truckCompanyId>
            </userTruckingCompanyMapping>
        </Create>
    </Query>
    `,
        DELETE: `
      <Query>
          <DeleteAll>
            <userTruckingCompanyMapping>
              <userName>{userName}</userName>
              <truckCompanyId>{truckCompanyId}</truckCompanyId>
            </userTruckingCompanyMapping>
          </DeleteAll>
      </Query>
    `
    },
    TRUCK: {
        OBJECT_FIND: 'Truck',
        OBJECT_FIND_HISTORY_LOCATION: 'HistoricalTruckInformation',
        OBJECT_FIND_EVENT: 'TruckEvents',
        DOWNLOAD_TRUCK_DATA_TEMPLATE: '<DownloadTruckDataTemplate/>',
        FIND_ALL: `
    <Query>
        <Find nested="*">
            <Truck>
                <sysid ne=""/>
            </Truck>
        </Find>
    </Query>
    `,
        FIND_ALL_BY_COMPANY: `
    <Query>
        <Find nested="*">
            <Truck>
                <companyId in="{0}"></companyId>
            </Truck>
        </Find>
    </Query>
    `,
        FIND_BY_ID: `
   <Query>
        <Find nested="*">
            <Truck>
                <sysId in="{0}"></sysId>
            </Truck>
        </Find>
    </Query>
    `,
        FIND_BY_TRUCK_PLATE: `
   <Query>
        <Find nested="*">
            <Truck>
                <truckPlate in="{0}"></truckPlate>
            </Truck>
        </Find>
    </Query>
    `,
        CREATE_TRUCK: `<Query>
        <Create>
            <Truck>
                <truckPlate>{truckPlate}</truckPlate>
                <safeLoadingPassDate>{safeLoadingPassDate}</safeLoadingPassDate>
                <totalCapacity>{totalCapacity}</totalCapacity>
                <isPtoSupported>{isPtoSupported}</isPtoSupported>
                <companyId>{companyId}</companyId>
            </Truck>
        </Create>
    </Query>`,
        CREATE_COMPARTMENT: `<Query>
            <Create>
                {0}
            </Create>
        </Query>`,
        COMPARTMENT_PAYLOAD: `
        <TruckCompartment>
            <compartmentNumber>{compartmentNumber}</compartmentNumber>
            <capacity>{capacity}</capacity>
            <compartmentStatus>InService</compartmentStatus>
            <truckId>{truckId}</truckId>
        </TruckCompartment>
            `,
        UPDATE_TRUCK: `<Query>
        <Update mode="unsafe">
            <Truck>
                <sysId>{sysId}</sysId>
                <truckPlate>{truckPlate}</truckPlate>
                <totalCapacity>{totalCapacity}</totalCapacity>
                <isPtoSupported>{isPtoSupported}</isPtoSupported>
                <dedicated>{dedicated}</dedicated>
                <companyId>{companyId}</companyId>
                <safeLoadingPassDate>{safeLoadingPassDate}</safeLoadingPassDate>
                <truckState>{truckState}</truckState>
            </Truck>
        </Update>
    </Query>`,
        UPDATE_TRUCK_COMPARTMENT: `<UpdateTruckCompartmentDetails><truckPlateNumber>{0}</truckPlateNumber><compartmentNumber>{1}</compartmentNumber><compartmentCapacity>{2}</compartmentCapacity></UpdateTruckCompartmentDetails>`,
        DELETE: `
    <Query>
        <DeleteAll>
            <Truck>
                <sysId>{sysId}</sysId>
            </Truck>
        </DeleteAll>
    </Query>
    `,
        FIND_HISTORICAL_LOCATION_BY_DATE_RANGE: `
    <Query>
        <Find orderBy="HistoricalTruckInformation.readingTime desc">
            <HistoricalTruckInformation>
                <vehicleNo>{0}</vehicleNo>
                <readingTime>
                  <ge>{1}</ge>
                  <le>{2}</le>
                </readingTime>
            </HistoricalTruckInformation>
        </Find>
    </Query>
    `,
        FIND_TRUCK_EVENT_BY_DATE_RANGE: `
    <Query>
        <Find nested="1" orderBy="TruckEvents.startTime desc">
            <TruckEvents>
                <vehicleNo>{0}</vehicleNo>
                <startTime>
                    <ge>{1}</ge>
                    <le>{2}</le>
                </startTime>
            </TruckEvents>
        </Find>
    </Query>
    `,
        UPLOAD_FILE: `
        <UploadTruckInspectionResult>
            <Base64Data>
                {Base64Data}
            </Base64Data>
            <truckPlate>
                {truckPlate}
            </truckPlate>
         </UploadTruckInspectionResult>
        `,
        UPDATE_STATUS: `
        <Query>
            <Save mode="unsafe">
                <Truck>
                    <sysId>{0}</sysId>
                    <truckState>{1}</truckState>
                </Truck>
            </Save>
        </Query>
        `,
        FIND_ALL_TRUCK_SCHEDULES: `
        <Find nested="*" only="sysId,dropNumber,isPtoSupported,truckId,tripId,truckPlate,totalCapacity,item,productCode,quantity,stationName,scheduledTimeFrom,scheduledTimeTo,estimatedTime,scheduleStatus,orderStatus,tripStatus">
            <Truck>
                <SysId ne="" as="var.truckId"/>
            </Truck>
            <TruckTrip>
                <scheduledTimeFrom>
                    <between>{0},{1}</between>
                </scheduledTimeFrom>
                <SysId as="var.tripId" ne=""/>
                <truckId>var.truckId</truckId>
            </TruckTrip>
            <SystemSchedule>
                <truckId>var.truckId</truckId>
                <tripId>var.tripId</tripId>
                <orderId as="var.orderId" ne=""/>
                <StationId as="var.stationId" ne=""/>
            </SystemSchedule>
            <Station>
                <SysId>var.stationId</SysId>
            </Station>
            <Order>
                <SysId>var.OrderId</SysId>
            </Order>
        </Find>
        `,
        UPDATE_TRUCK_SCHEDULE: `
        <Query>
            <UpdateOrderSchedule>
                <tripId>{0}</tripId>
                <terminalArrivalTime>{1}</terminalArrivalTime>
                <terminalReturnTime>{2}</terminalReturnTime>
            </UpdateOrderSchedule>
        </Query>`,
        TRIGGER_SCHEDULE: `
        <Query>
            <TriggerOptimizeScheduler/>
        </Query>
        `,
        APPROVE_SCHEDULE: `<Query><UpdateTruckScheduleStatus><tripId>{0}</tripId></UpdateTruckScheduleStatus></Query>`,
        FIND_TRUCK_BY_ORDER_ID: `<Query>
        <find>
         <SystemSchedule>
                    <orderId in="{0}"></orderId>
                    <truckId as="var.truckId" ne=""></truckId>
                </SystemSchedule>
                <Truck>
                    <SysId>var.truckId</SysId>
                </Truck>
            </find>
    </Query>`,
        FIND_TRUCK_MAPPING_DATA_BY_TIME_RANGE: `
    <Query>
        <Find>
            <TruckDriverMapping>
                <sysId ne=""/>
                <dayTime ge="{0}" le="{1}"/>
                <as>var.map</as>
            </TruckDriverMapping>
            <Truck>
                <sysId>var.map.truckId</sysId>
                <truckState>InService</truckState>
            </Truck>
            <DriverProfile>
                <driverId>var.map.driverId</driverId>
                <profileDate ge="{0}" le="{1}"/>
                <driverDailyStatus><in>A,P</in></driverDailyStatus>
            </DriverProfile>
        </Find>
    </Query>`,
        UPDATE_TRUCK_DEDICATED: `
    <UpdateTruckRegionDetails>
      <TruckId>{0}</TruckId>
      <DedicatedRegionProducts>
      {1}
      </DedicatedRegionProducts>
    </UpdateTruckRegionDetails>
    `,
        DELETE_ALL_TRUCK_DEDICATED: `
    <DeleteRegionDetailsFromTruck>
      <TruckId>{0}</TruckId>
    </DeleteRegionDetailsFromTruck>
    `
    },
    TRUCK_DRIVER_MAPPING: {
        OBJECT_FIND: 'TruckDriverMapping',
        FIND_ALL_BY_DATE_RANGE: `
    <Query>
        <Find>
            <TruckDriverMapping>
                <dayTime ge="{0}" le="{1}"/>
            </TruckDriverMapping>
        </Find>
    </Query>
    `,
        FIND_ALL_BY_TRUCK_DATE_RANGE: `
    <Query>
        <Find>
            <TruckDriverMapping>
                <truckId in="{0}"></truckId>
                <dayTime ge="{1}" le="{2}"/>
            </TruckDriverMapping>
        </Find>
    </Query>
    `,
        FIND_BY_TRUCKS: `
    <Query>
      <Find>
        <TruckDriverMapping>
          <truckId in="{0}"/>
        </TruckDriverMapping>
      </Find>
    </Query>
    `,
        CREATE: `
    <AssignDriverToTruck>
            <driverId>{0}</driverId>
            <truckId>{1}</truckId>
            <userName>{2}</userName>
            <dayTimestamp>{3}</dayTimestamp>
    </AssignDriverToTruck>
    `,
        DELETE: `
    <RemoveDriverToTruck>
        <driverId>{0}</driverId>
        <truckId>{1}</truckId>
        <mappingId>{2}</mappingId>
    </RemoveDriverToTruck>
    `
    },
    TRUCK_TRIP: {
        OBJECT_FIND: 'TruckTrip',
        CREATE: `
        <Query>
            <Create>
                <TruckTrip>
                  <truckId>{truckId}</truckId>
                  <scheduledTimeFrom>{scheduledTimeFrom}</scheduledTimeFrom>
                  <scheduledTimeTo>{scheduledTimeTo}</scheduledTimeTo>
                  <tripStatus>AtTerminal</tripStatus>
                </TruckTrip>
            </Create>
        </Query>
      `,
        EXPORT: `
        <ExportScheduleByTimestamp>
	<startTimestamp>{0}</startTimestamp>
	<endTimestamp>{1}</endTimestamp>
</ExportScheduleByTimestamp>
        ` //DD-MM-YYYY
    },
    REGION: {
        OBJECT_FIND: 'Region',
        FIND_ALL: `<GetRegions/>`,
        FIND_BY_ID: `
            <GetRegionDetails>
            <regionId>{0}</regionId>
            </GetRegionDetails>
        `,
        DELETE: `
            <DeleteRegion>
                <regionId>{0}</regionId>
            </DeleteRegion>
        `,
        DELETE_TRUCK_RATE: `
      <DeleteTruckRatesFromRegion>
	<regionId>{0}</regionId>
</DeleteTruckRatesFromRegion>
      `,
        DELETE_SUPPLY_POINT: `
      <DeleteAllRegionSupplyPoints>
	<regionId>{0}</regionId>
</DeleteAllRegionSupplyPoints>
      `,
        CREATE: `
        <CreateRegion>
            <regionName>{0}</regionName>
            <description>{1}</description>
            <associatedTerminalID>{2}</associatedTerminalID>
        </CreateRegion>
    `,
        DELETE_GEO_POINTS: `
      <DeleteGeoFencePoint>
	<regionId>{0}</regionId>
</DeleteGeoFencePoint>
      `,
        UPDATE: `
      <UpdateRegion>
	<regionId>{0}</regionId>
	{1}
	 <geoFencePoints>
        	 {2}
        </geoFencePoints>
</UpdateRegion>
      `
    },
    BASE_PRODUCT: {
        OBJECT_FIND: 'BaseProduct',
        FIND_ALL: `<ListAllBaseProducts></ListAllBaseProducts>`,
        FIND_BY_ID: `

        `,
        DELETE: `
           <deleteBaseProduct>
   <sysId>{0}</sysId>
</deleteBaseProduct>
        `,
        DELETE_TRUCK_RATE: `
      <DeleteTruckRatesFromRegion>
	<regionId>{0}</regionId>
</DeleteTruckRatesFromRegion>
      `,
        CREATE: ``,
        DELETE_GEO_POINTS: `

      `,
        UPDATE: `
      `
    },
    DELIVERY_POINT_GROUP: {
        OBJECT_FIND: 'DeliveryPointGroup',
        FIND_ALL: `<DeliveryPointGroupListData/>`,
        FIND_BY_ID: `<GetDeliveryPointGroupData><DeliveryPointGroupId>{0}</DeliveryPointGroupId></GetDeliveryPointGroupData>`,
        DELETE: `<DeleteDeliveryPointGroupsData><DeliveryPointGroupId>{0}</DeliveryPointGroupId></DeleteDeliveryPointGroupsData>`,
        CREATE: `<CreateDeliveryPointGroupsData>
                <DeliveryPointGroupName>{0}</DeliveryPointGroupName>
                <Description>{1}</Description>
            </CreateDeliveryPointGroupsData>
        `,
        DELETE_STATION_REF: `<DeleteAllDeliveryPoints><DeliveryPointGroupId>{0}</DeliveryPointGroupId></DeleteAllDeliveryPoints>`,
        UPDATE: `<UpdateDeliveryPointGroupsData>
            <DeliveryPointGroupId>{0}</DeliveryPointGroupId>
                <DeliveryPointGroupName>{1}</DeliveryPointGroupName>
                <Description>{2}</Description>
                <DeliveryPoints>{3}</DeliveryPoints>
            </UpdateDeliveryPointGroupsData>
        `
    },
    FLEET_BASE: {
        OBJECT_FIND: 'FleetBase',
        FIND_ALL: `<ListAllFleetBases></ListAllFleetBases>`,
        FIND_BY_ID: `<getFleetBaseData><sysId>{0}</sysId></getFleetBaseData>`,
        DELETE: `<deleteFleetBase><FleetBaseId>{0}</FleetBaseId></deleteFleetBase>`,
        DELETE_GEO_POINTS: `<DeleteGeoFencePoint><fleetBaseId>{0}</fleetBaseId></DeleteGeoFencePoint>`,
        UPDATE: `<updateFleetBase>
            <fleetbaseId>{0}</fleetbaseId>
            {1}
            <geofencePoints>{2}</geofencePoints>
        </updateFleetBase>`,
        CREATE: `<createFleetBase>
            <fleetBaseName>{0}</fleetBaseName>
            <description>{1}</description>
            <rotATimeSpan>{2}</rotATimeSpan>
            <geofencePoints>{3}</geofencePoints>
        </createFleetBase>`
    },
    TRIP_PREFERENCE: {
        OBJECT_FIND: 'TripReference',
        FIND_ALL: `
     <ListAllTripReferences/>
    `,
        FIND_BY_ID: `
  <GetTripReferenceById>
    <TripReferenceId>{0}</TripReferenceId>
  </GetTripReferenceById>
    `,
        DELETE: ``,
        DELETE_GEO_POINTS: ``,
        UPDATE: `
    <UpdateTripReference>
      <TripReferenceId>{0}</TripReferenceId>
      {1}

    </UpdateTripReference>
    `,
        CREATE: ``
    },
    PRODUCT: {
        OBJECT_FIND: 'Product',
        FIND_ALL: `<ListAllProducts></ListAllProducts>`,
        FIND_BY_ID: ``,
        DELETE: ``,
        DELETE_GEO_POINTS: ``,
        UPDATE: ``,
        CREATE: ``,
        FIND_BY_IDS: `
      <Find>
        <Product>
          <sysid in="{0}"></sysid>
        </Product>
      </Find>
      `
    },
    SUPPLY_POINT: {
        OBJECT_FIND: 'SupplyPoint',
        FIND_ALL: `<SupplyPointListData />`,
        FIND_BY_ID: `<GetSupplyPointData><supplyPointId>{0}</supplyPointId></GetSupplyPointData>`,
        CREATE: `<CreateSupplyPointData>
            <supplyName>{0}</supplyName>
            <description>{1}</description>
            <products>{2}</products>
        </CreateSupplyPointData>`,
        UPDATE: `
      <UpdateSupplyPointData>
        <supplyPointId>{0}</supplyPointId>
        {1}
        <geofencePoints>
          {2}
        </geofencePoints>
      </UpdateSupplyPointData>
      `,
        DELETE_GEO_POINTS: `<DeleteGeoFencePoint><supplyPointId>{0}</supplyPointId></DeleteGeoFencePoint>`,
        DELETE: `<DeleteSupplyPointData><supplyPointId>{0}</supplyPointId></DeleteSupplyPointData>`,
        DELETE_PRODUCT: `
      <DeleteAllProductsFromSupplyPoint>
	<supplyPointId>{0}</supplyPointId>
</DeleteAllProductsFromSupplyPoint>
      `,
        FIND_ALL_NESTED: `
      <Find nested="*">
        <SupplyPoint>
          <sysid ne=""></sysid>
        </SupplyPoint>
      </Find>
      `
    },
    EXCEPTION_AREAS: {
        OBJECT_FIND: 'ExceptionArea',
        FIND_ALL: `<GetAllExceptionAreas/>`,
        FIND_BY_ID: `<GetExceptionAreaDetails>
	<ExceptionAreaId>{0}</ExceptionAreaId>
</GetExceptionAreaDetails>`,
        CREATE: `<CreateExceptionArea>
            <exceptionAreaName>{0}</exceptionAreaName>
            <description>{1}</description>
            <isRestricted>{2}</isRestricted>
        </CreateExceptionArea>`,
        UPDATE: `
      <UpdateExceptionArea>
        <ExceptionAreaId>{0}</ExceptionAreaId>
        {1}
        <geoFencePoints>
          {2}
        </geoFencePoints>
      </UpdateExceptionArea>
      `,
        DELETE_GEO_POINTS: `<DeleteGeoFencePoint>
	<ExceptionAreaId>{0}</ExceptionAreaId>
</DeleteGeoFencePoint>`,
        DELETE: `<DeleteExceptionArea>
	<ExceptionAreaId>{0}</ExceptionAreaId>
</DeleteExceptionArea>`
    },
    TRUCK_STOP: {
        OBJECT_FIND: 'TruckStop',
        FIND_ALL: `<TruckStopListData/>`,
        FIND_BY_ID: `<GetTruckStopData>
	<truckStopId>{0}</truckStopId>
</GetTruckStopData>`,
        CREATE: `<CreateTruckStopData><truckStopName>{0}</truckStopName><description>{1}</description></CreateTruckStopData>`,
        UPDATE: `
      <UpdateTruckStopData>
	<truckStopId>{0}</truckStopId>
      {1}
        <geoFencePoints>
        	 {2}
        </geoFencePoints>
</UpdateTruckStopData>
      `,
        DELETE_GEO_POINTS: `<DeleteGeoFencePoint><truckStopId>{0}</truckStopId></DeleteGeoFencePoint>`,
        DELETE: `<DeleteTruckStopData><truckStopId>{0}</truckStopId></DeleteTruckStopData>`
    },
    HELP_LINK: {
        CREATE: `<CreateHelpLink>
            <FileName>{0}</FileName>
            <Key>{1}</Key>
            <Value>{2}</Value>
            <Description>{3}</Description>
        </CreateHelpLink> 
    `,
        UPDATE: `<UpdateHelpLink>
            <SysId>{0}</SysId>
            <FileName>{1}</FileName>
            <Key>{2}</Key>
            <Value>{3}</Value>
            <Description>{4}</Description>
        </UpdateHelpLink>
    `,
        DELETE: `<DeleteHelpLink><SysId>{0}</SysId></DeleteHelpLink>`,
        LIST: `<GetHelpLinkList/>`
    },
    HELP_DOCUMENT: {
        CREATE: `<CreateHelpDocument>
            <fileName>{0}</fileName>
            <fileDate>{1}</fileDate>
            <fileSize>{2}</fileSize>
            <fileKind>{3}</fileKind>
            <AccessRoles>{4}</AccessRoles>
            <Base64String>{5}</Base64String>
        </CreateHelpDocument>
    `,
        UPDATE: `<UpdateHelpDocument>
            <HelpDocumentId>{0}</HelpDocumentId>
            <AccessRoles>{2}</AccessRoles>
        </UpdateHelpDocument>
    `,
        DELETE: `<DeleteHelpDocument><SysId>{0}</SysId></DeleteHelpDocument>`,
        DELETE_ROLES_REF: `<DeleteHelpDocAccessRoles><helpDocumentId>{0}</helpDocumentId></DeleteHelpDocAccessRoles>`,
        LIST: `<GetHelpDocumentList><UserId>{0}</UserId></GetHelpDocumentList>`
    },
    UPDATE_TYPE: {
        OBJECT_FIND: 'UpdateType',
        FIND_ALL: `
    <Query>
        <Find>
            <UpdateType>
                <sysId ne=""/>
            </UpdateType>
        </Find>
    </Query>
    `
    },
    DRIVER: {
        OBJECT_FIND: 'Driver',
        DOWNLOAD_DRIVER_DATA_TEMPLATE: '<DownloadDriverDataTemplate/>',
        DOWNLOAD_TRUCK_DATA_TEMPLATE: '<DownloadTruckDataTemplate/>',
        FIND_ALL: `
   <Query>
      <Find>
          <Driver>
              <sysid ne=""/>
          </Driver>
      </Find>
  </Query>
    `,
        FIND_ALL_BY_COMPANY: `
    <Query>
       <Find>
           <Driver>
                <companyId in="{0}"></companyId>
           </Driver>
       </Find>
   </Query>
     `,
        FIND_BY_ID: `
   <Query>
        <Find>
            <Driver>
                <sysId>{0}</sysId>
            </Driver>
        </Find>
    </Query>
    `,
        CREATE_DRIVER: `<Query>
        <Create>
            <Driver>
                <driverLicenceNumber>{driverLicenceNumber}</driverLicenceNumber>
                <companyId>{companyId}</companyId>
                <fullName>{fullName}</fullName>
                <address>{address}</address>
                <contactNumber>{contactNumber}</contactNumber>
                <chevronDriverId>{chevronDriverId}</chevronDriverId>
                <terminalPassExpiryDate>{terminalPassExpiryDate}</terminalPassExpiryDate>
                <driverStatus>{driverStatus}</driverStatus>
            </Driver>
        </Create>
    </Query>`,
        UPDATE_DRIVER: `<Query>
        <Update mode="unsafe">
            <Driver>
                <sysId>{sysId}</sysId>
                <driverLicenceNumber>{driverLicenceNumber}</driverLicenceNumber>
                <companyId>{companyId}</companyId>
                <fullName>{fullName}</fullName>
                <address>{address}</address>
                <contactNumber>{contactNumber}</contactNumber>
                <chevronDriverId>{chevronDriverId}</chevronDriverId>
                <terminalPassExpiryDate>{terminalPassExpiryDate}</terminalPassExpiryDate>
            </Driver>
        </Update>
    </Query>`,
        DELETE_DRIVER: `<Query>
        <DeleteAll>
            <Driver>
                <sysId>{sysId}</sysId>
            </Driver>
        </DeleteAll>
    </Query>`
    },
    DRIVER_PROFILE: {
        OBJECT_FIND: 'DriverProfile',
        FIND_BY_ID: `
    <Query>
        <Find nested="1">
            <DriverProfile>
                <driverId eq="{0}"/>
                <profileDate>
                <ge>{1}</ge>
                <le>{2}</le>
            </profileDate>
            </DriverProfile>
        </Find>
    </Query>
    `,
        UPLOAD_FILE: `
    <UploadDriverSITResult>
        <Base64Data>
            {Base64Data}
        </Base64Data>
        <chevronDriverId>
            {chevronDriverId}
        </chevronDriverId>
    </UploadDriverSITResult>
    `,
        UPLOAD_FILE_DRIVERS: `<UploadDriverData><Base64Data>{0}</Base64Data></UploadDriverData>`,
        UPLOAD_FILE_TRUCKS: `<UploadTruckData><Base64Data>{0}</Base64Data></UploadTruckData>`,
        CREATE_DRIVER_DAILY_PROFILE: `<query>
    <create>
        <DriverProfile>
            <driverId>{driverId}</driverId>
            <profileDate>{profileDate}</profileDate>
            <driverDailyStatus>{status}</driverDailyStatus>
        </DriverProfile>
         <DriverSleepingHours>
            <driverId>{driverId}</driverId>
             <sleepStartTime>{sleepStartTime}</sleepStartTime>
             <wakingUpTime>{wakingUpTime}</wakingUpTime>
        </DriverSleepingHours>
        <DriverWorkingHours>
        	<driverId>{driverId}</driverId>
             <workingStartTime>{workStartTime}</workingStartTime>
             <workingEndTime>{workEndTime}</workingEndTime>
        </DriverWorkingHours>
        <profileDate>{profileDate}</profileDate>
        <driverDailyStatus>{status}</driverDailyStatus>
    </create>
</query>
`,
        UPDATE_DRIVER_DAILY_PROFILE: `
<UpdateDriverProfile>
    <driverId>{driverId}</driverId>
        <sleeping>
            <sysId>{sleepingTimeId}</sysId>
            <sleepStartTime>{sleepStartTime}</sleepStartTime>
            <wakingUpTime>{wakingUpTime}</wakingUpTime>
        </sleeping>
        <working>
            <sysId>{workingTimeId}</sysId>
            <workingStartTime>{workStartTime}</workingStartTime>
            <workingEndTime>{workEndTime}</workingEndTime>
        </working>
        <profileDate>{profileDate}</profileDate>
        <driverDailyStatus>{status}</driverDailyStatus>
</UpdateDriverProfile>`,
        FIND_DRIVER_STATUS: `
    <Query>
        <Find>
            <StaticData>
                <type>driverStatus</type>
            </StaticData>
        </Find>
    </Query>`,
        FIND_DRIVER_CURRENT_STATUS: `
    <Query>
        <Find>
                <Driver>
                        <sysId ne=""/>
                        <as>var.driv</as>
                </Driver>
                <DriverProfile>
                        <driverId>var.driv.sysId</driverId>
                        <profileDate><ge>{0}</ge><le>{1}</le></profileDate>
                </DriverProfile>
        </Find>
</Query>
    `,
        FIND_DRIVER_SLEEPING_TIME_IN_TIMERANGE: `
        <Query>
    <Find>
    <DriverSleepingHours>
       <driverId>{0}</driverId>
        <sleepStartTime><ge>{1}</ge></sleepStartTime>
        <wakingUpTime><le>{2}</le></wakingUpTime>
    </DriverSleepingHours>
    </Find>
    </Query>
    `,
        FIND_DRIVER_WORKING_TIME_IN_TIMERANGE: `
        <Query>
    <Find>
    <DriverWorkingHours>
         <driverId>{0}</driverId>
         <workingStartTime><ge>{1}</ge></workingStartTime>
         <workingEndTime><le>{2}</le></workingEndTime>
    </DriverWorkingHours>
    </Find>
    </Query>
    `,
        FIND_ALTERNATIVE_DRIVER_SLEEPING_TIME_IN_TIMERANGE: `
        <Query>
    <Find>
    <DriverSleepingHours>
    <driverId>{0}</driverId>
        <wakingUpTime><ge>{1}</ge></wakingUpTime>
        <sleepStartTime><le>{2}</le></sleepStartTime>
    </DriverSleepingHours>
    </Find>
    </Query>
    `,
        FIND_ALTERNATIVE_DRIVER_WORKING_TIME_IN_TIMERANGE: `
        <Query>
    <Find>
    <DriverWorkingHours>
        <driverId>{0}</driverId>
        <workingEndTime><ge>{1}</ge></workingEndTime>
        <workingStartTime><le>{2}</le> </workingStartTime>
    </DriverWorkingHours>
    </Find>
    </Query>
    `,
        FIND_DRIVER_STATUS_IN_TIMERANGE: `
    <Query>
    <Find>
        <DriverProfile>
            <driverId eq="{0}"/>
            <profileDate>
            <ge>{1}</ge>
            <le>{2}</le>
        </profileDate>
        </DriverProfile>
        </Find>
    </Query>
    `,
        CREATE_DRIVER_SLEEPING_TIME: `
    <create>
        <DriverSleepingHours>
            <driverId>{0}</driverId>
            <sleepStartTime>{1}</sleepStartTime>
            <wakingUpTime>{2}</wakingUpTime>
        </DriverSleepingHours>
     </create>`,
        CREATE_DRIVER_WORKING_TIME: `
    <create>
        <DriverWorkingHours>
            <driverId>{0}</driverId>
            <workingStartTime>{1}</workingStartTime>
            <workingEndTime>{2}</workingEndTime>
        </DriverWorkingHours>
     </create>`,
        CREATE_DRIVER_STATUS: `<query>
     <create>
         <DriverProfile>
             <driverId>{driverId}</driverId>
             <profileDate>{profileDate}</profileDate>
             <driverDailyStatus>{status}</driverDailyStatus>
         </DriverProfile>
     </create>
 </query>`,
        UPDATE_DRIVER_STATUS: `
        <Find>
            <DriverProfile>
                <driverId>{driverId}</driverId>
                <profileDate>{profileDate}</profileDate>
        </DriverProfile>
                </Find>
        <update mode="unsafe">
            <DriverProfile>
                <sysid>[:$response.Message.Value.Find.Result.DriverProfile.Sysid:]</sysid>
                <driverDailyStatus>{status}</driverDailyStatus>
            </DriverProfile>
        </update>`,
        UPDATE_DRIVER_SLEEPING_TIME: `
        <Find>
    <DriverSleepingHours>
         <driverId>{0}</driverId>
          <sleepStartTime>{3}</sleepStartTime>
      <wakingUpTime>{4}</wakingUpTime>
    </DriverSleepingHours>
    </Find>

    <update mode="unsafe">
        <DriverSleepingHours>
           <sysid>[:$response.Message.Value.Find.Result.DriverSleepingHours.Sysid:]</sysid>
           <sleepStartTime>{1}</sleepStartTime>
        <wakingUpTime>{2}</wakingUpTime>
            </DriverSleepingHours>
        </update>`,
        UPDATE_DRIVER_WORKING_TIME: `
        <Find>
    <DriverWorkingHours>
         <driverId>{0}</driverId>
          <workingStartTime>{3}</workingStartTime>
      <workingEndTime>{4}</workingEndTime>
    </DriverWorkingHours>
    </Find>

    <update mode="unsafe">
        <DriverWorkingHours>
           <sysid>[:$response.Message.Value.Find.Result.DriverWorkingHours.Sysid:]</sysid>
           <workingStartTime>{1}</workingStartTime>
        <workingEndTime>{2}</workingEndTime>
            </DriverWorkingHours>
        </update>
`,
        DELETE: `
      <DeleteAll>
            <DriverProfile>
              <sysId>{sysId}</sysId>
              </DriverProfile>
        </DeleteAll>
      `,
        DELETE_ALL_SLEEPING_TIME_BY_ID: `
        <DeleteAll>
            <DriverSleepingHours>
                <sysid>{sysId}</sysid>
            </DriverSleepingHours>
        </DeleteAll>
        `,
        DELETE_ALL_WORKING_TIME_BY_ID: `
        <DeleteAll>
            <DriverWorkingHours>
                <sysid>{sysId}</sysid>
            </DriverWorkingHours>
        </DeleteAll>
        `
    },
    INVENTORY: {
        OBJECT_FIND_HISTORY: 'StationProductInventoryHistory',
        FIND_PREDICTION: `
    <GetPredictedInventory>
      <stationName>{0}</stationName>
    </GetPredictedInventory>
    `,
        FILE_UPLOAD_BY_DATE: `
      <InventoryFileUploadbyDate>
<date>{0}</date>
</InventoryFileUploadbyDate>
      `,
        IMPORT_FILE: `
    <InventoryFileUploadStatus>
        <Base64Data>
        {0}
        </Base64Data>
    </InventoryFileUploadStatus>
    `,
        GET_IMPORT_FILE_CONTENT: `
      <InventoryFileUploadbyDate>
        <srcFilename>{0}</srcFilename>
        <date>{1}</date>
      </InventoryFileUploadbyDate>
    `,
        IMPORT_DATA: `
      <ImportInventoryData>
        <srcFileName>{0}</srcFileName>
        <isplannedOrderChecked>{1}</isplannedOrderChecked>
      </ImportInventoryData>
    `,
        GET_INVENTORY_BY_STATION:
            `<Query>
             <Find orderBy="StationProductInventoryHistory.readingTime desc">
                <StationProductInventoryHistory>
                    <stationId>{0}</stationId>
                    <readingTime>
                        <ge>{1}</ge>
                        <le>{2}</le>
                    </readingTime>
                </StationProductInventoryHistory>
            </Find>
        </Query>`,
        COUNT_INVENTORY_BY_STATION:
            `<Query>
             <Find>
                <StationProductInventoryHistory>
                    <stationId>{0}</stationId>
                    <readingTime>
                        <ge>{1}</ge>
                        <le>{2}</le>
                    </readingTime>
                </StationProductInventoryHistory>
            </Find>
        </Query>
       <SetResponse>
                    <Message>
                        <Value><count>[:$Response.Message.Value.Find/count(Result):]</count></Value>
                    </Message>
            </SetResponse>`,

    },
    CUSTOMER: {
        OBJECT_FIND: 'Customer',
        FIND_ALL: `
   <Query>
        <Find>
             <Customer>
              <sysId ne=""></sysId>
            </Customer>
        </Find>
    </Query>
    `,
        FIND_BY_ID: `
   <Query>
        <Find>
            <Customer>
                <sysId>{0}</sysId>
            </Customer>
        </Find>
    </Query>
    `,
        FIND_BY_NAME: `
   <Query>
        <Find>
            <Customer>
                <customerName>{0}</customerName>
            </Customer>
        </Find>
    </Query>
    `,
        FIND_BY_STATION_ID: `
    <Query>
        <Find>

        	<Customer>
            	<sysId>{0}</sysId>
            </Customer>
    	      </Find>
    </Query>
    `,
        CREATE_CUSTOMER: `
    <Query>
        <Create>
            <Customer>
                <customerName>{customerName}</customerName>
                <contactNumber>{contactNumber}</contactNumber>
                <customerAddress>{customerAddress}</customerAddress>
                <emailAddress>{emailAddress}</emailAddress>
                <userName>{userName}</userName>
                <chevronCustomerId>{chevronCustomerId}</chevronCustomerId>
                <soldTo>{soldTo}</soldTo>
                <lastUpdated>[:$Now():]</lastUpdated>
            </Customer>
        </Create>
    </Query>
    `,
        UPDATE_CUSTOMER: `
    <Save mode="unsafe">
        <Customer>
            <sysId>{sysId}</sysId>
            <customerName>{customerName}</customerName>
            <contactNumber>{contactNumber}</contactNumber>
            <customerAddress>{customerAddress}</customerAddress>
            <emailAddress>{emailAddress}</emailAddress>
            <userName>{userName}</userName>
            <soldTo>{soldTo}</soldTo>
            <lastUpdated>[:$Now():]</lastUpdated>
        </Customer>
    </Save>
    `,
        DELETE: `
    <Query>
        <DeleteAll>
            <Customer>
                <Sysid eq="{sysId}"/>
                <userName>{userName}</userName>
            </Customer>
        </DeleteAll>
    </Query>
    `
    },
    QUOTA: {
        OBJECT_FIND: 'ProductQuota',
        FIND_ALL: `
          <Query>
            <Find>
                <ProductQuota>
                    <sysid ne=""></sysid>
                </ProductQuota>
            </Find>
        </Query>
    `,
        FIND_ALL_BY_STATION: `
         <Query>
            <Find>
                <ProductQuota>
                    <StationId in="{0}"></StationId>
                </ProductQuota>
            </Find>
        </Query>
    `,
        FIND_BY_ID: `
         <Query>
            <Find>
                <ProductQuota>
                    <sysId>{0}</sysId>
                </ProductQuota>
            </Find>
        </Query>
    `,
        CREATE: `
        <Query>
            <Create>
                <ProductQuota>
                    <StationId>{StationId}</StationId>
                    <ProductCode>{ProductCode}</ProductCode>
                    <MonthlyQuota>{MonthlyQuota}</MonthlyQuota>
                    <RemainingQuota>{RemainingQuota}</RemainingQuota>
                </ProductQuota>
            </Create>
        </Query>
        `,
        UPDATE: `
        <Query>
            <UpdateStationMonthlyQuota>
                <StationId>{0}</StationId>
                <ProductCode>{1}</ProductCode>
                <MonthlyQuota>{2}</MonthlyQuota>
                <RemainingQuota>{3}</RemainingQuota>
            </UpdateStationMonthlyQuota>
        </Query>
        `,
        UPLOAD_FILE: `
        <QuotaManagementFileUploadStatus>
            <Base64Data>{0}</Base64Data>
        </QuotaManagementFileUploadStatus>
    `,
        GET_DATA_FROM_FILE: `<QuotaManagementFileParse>
            <srcFilename>{0}</srcFilename>
        </QuotaManagementFileParse>
    `,
        ADD_QUOTA_WITH_PRODUCT_CODE: `<QuotaManagementDataSave><ProductQuotaData>{0}</ProductQuotaData></QuotaManagementDataSave>`,
        DELETE_ALL_QUOTA: `

    `,
        DELETE: `
        <Query>
            <DeleteAll>
                <ProductQuota>
                    <sysId>{0}</sysId>
                </ProductQuota>
            </DeleteAll>
        </Query>
    `
    },
    TANK: {
        OBJECT_FIND: 'StationTank',
        FIND_ALL: `
   <Query>
        <Find>
            <StationTank>
                <stationId ne=""></stationId>
            </StationTank>
        </Find>
    </Query>
    `,
        FIND_BY_STATION_ID: `
    <Query>
         <Find>
             <StationTank>
                 <stationId in="{0}"></stationId>
             </StationTank>
         </Find>
     </Query>
     `,
        FIND_BY_ID: `
    <Query>
        <Find>
            <StationTank>
                <sysId>{0}</sysId>
            </StationTank>
        </Find>
    </Query>
    `,
        CREATE_TANK: `
    <Query>
        <Create>
            <StationTank>
                <deadStock>{deadStock}</deadStock>
                <maxFillCapacity>{maxFillCapacity}</maxFillCapacity>
                <tankNumber>{tankNumber}</tankNumber>
                <currentUllage>{currentUllage}</currentUllage>
                <thirdPartyTankId/>
                <currentVolume>{currentVolume}</currentVolume>
                <stationId>{stationId}</stationId>
                <maxFillCapacityPercentage>{maxFillCapacityPercentage}</maxFillCapacityPercentage>
                <isPtoReq>{isPtoReq}</isPtoReq>
                <productCode>{productCode}</productCode>
                <tankCapacity>{tankCapacity}</tankCapacity>
                <userName>{userName}</userName>
                <archived>{archived}</archived>
                <PreferredMaxFill>{preferredMaxFill}</PreferredMaxFill>
            </StationTank>
        </Create>
    </Query>
    `,
        UPDATE_TANK: `
        <Save mode="unsafe">
            <StationTank>
                <sysId>{sysId}</sysId>
                <deadStock>{deadStock}</deadStock>
                <maxFillCapacity>{maxFillCapacity}</maxFillCapacity>
                <tankNumber>{tankNumber}</tankNumber>
                <currentUllage>{currentUllage}</currentUllage>
                <thirdPartyTankId/>
                <currentVolume>{currentVolume}</currentVolume>
                <stationId>{stationId}</stationId>
                <maxFillCapacityPercentage>{maxFillCapacityPercentage}</maxFillCapacityPercentage>
                <isPtoReq>{isPtoReq}</isPtoReq>
                <productCode>{productCode}</productCode>
                <tankCapacity>{tankCapacity}</tankCapacity>
                <userName>{userName}</userName>
                <archived>{archived}</archived>
                <PreferredMaxFill>{PreferredMaxFill}</PreferredMaxFill>
            </StationTank>
        </Save>
    `,
        ARCHIVED_TANK: `
        <Query>
            <UpdateTankArchieved>
                <stationId>{0}</stationId>
                <tankNumber>{1}</tankNumber>
            </UpdateTankArchieved>
        </Query>
    `,
        DELETE_TANK: `
        <Query>
            <DeleteAll>
                <StationTank>
                    <sysId>{sysId}</sysId>
                    <userName>{userName}</userName>
                </StationTank>
            </DeleteAll>
        </Query>
    `,
        DELETE_ARCHIVED_TANK: `<DeleteStationTankArchieved><stationId>{0}</stationId><tankNumber>{1}</tankNumber></DeleteStationTankArchieved>`
    },
    STATION: {
        OBJECT_FIND: 'Station',
        OBJECT_FIND_PRODUCT: 'Product',
        FIND_ALL: `
    <Query>
        <Find nested="1" orderBy="Station.stationName">
            <Station>
                <sysId ne=""/>
            </Station>
        </Find>
    </Query>
    `,
        FIND_BY_ID: `
   <Query>
        <Find nested="1">
            <Station>
                <sysId>{0}</sysId>
            </Station>
        </Find>
    </Query>
    `,
        FIND_BY_NAME: `
   <Query>
        <Find nested="1">
            <Station>
                <stationName>{0}</stationName>
            </Station>
        </Find>
    </Query>
    `,
        FIND_BY_LIST_NAME: `
   <Query>
        <Find>
            <Station>
                <stationName in="{listName}"></stationName>
            </Station>
        </Find>
    </Query>
    `,
        FIND_BY_CUSTOMER_ID: `
   <Query>
        <Find nested="*">
            <Station>
                <customerId in="{0}"></customerId>
            </Station>
        </Find>
    </Query>
    `,
        FIND_BY_USERNAME: `
        <Query>
          <Find nested="1">
              <CustomerStationUserMapping  as="var.user">
                  <userName>{0}</userName>
                </CustomerStationUserMapping>
                <Station>
                  <sysId>var.user.stationId</sysId>
                </Station>
            </Find>
        </Query>
        `,
        CREATE_STATION: `
        <Query>
            <Create>
                <Station>
                    <stationName>{stationName}</stationName>
                    <shortName>{shortName}</shortName>
                    <streetAddress>{streetAddress}</streetAddress>
                    <stationType>{stationType}</stationType>
                    <contactNumber>{contactNumber}</contactNumber>
                    <distanceFromTerminal>{distanceFromTerminal}</distanceFromTerminal>
                    <estimatedHoursFromTerminal>{estimatedHoursFromTerminal}</estimatedHoursFromTerminal>
                    <customerId>{customerId}</customerId>
                    <shipTo>{shipTo}</shipTo>
                    <truckSize>{truckSize}</truckSize>
                    <userName>{userName}</userName>
                </Station>
            </Create>
        </Query>
    `,
        UPDATE_STATION: `
        <Save mode="unsafe">
            <Station>
                <sysId>{sysId}</sysId>
                <stationName>{stationName}</stationName>
                <shortName>{shortName}</shortName>
                <streetAddress>{streetAddress}</streetAddress>
                <stationType>{stationType}</stationType>
                <contactNumber>{contactNumber}</contactNumber>
                <distanceFromTerminal>{distanceFromTerminal}</distanceFromTerminal>
                <estimatedHoursFromTerminal>{estimatedHoursFromTerminal}</estimatedHoursFromTerminal>
                <customerId>{customerId}</customerId>
                <shipTo>{shipTo}</shipTo>
                <truckSize>{truckSize}</truckSize>
                <userName>{userName}</userName>
                <associatedTerminalId>{associatedTerminalId}</associatedTerminalId>
                <associatedRegionId>{associatedRegionId}</associatedRegionId>
                <deliveryPointGroupId>{deliveryPointGroupId}</deliveryPointGroupId>
            </Station>
        </Save>
    `,
        DELETE_STATION: `
        <Query>
            <DeleteAll>
                <Station>
                    <stationName>{stationName}</stationName>
                    <userName>{userName}</userName>
                 </Station>
            </DeleteAll>
        </Query>
    `,
        FIND_CURRENT_INVENTORY_BY_ID: `
      <GetCurrentInventoryAndTankDetails>
        <StationList>
            {0}
        </StationList>
      </GetCurrentInventoryAndTankDetails>
    `,
        FIND_CURRENT_INVENTORY: `
    <Query>
    <Find as="Station:Product:$None"
        only="StationProductInventory:productCode,StationProductInventory:stationId,StationProductInventory:totalQuantity,StationProductInventory:totalUllage,StationProductInventory:lastUpdated,StationProductProfile:deadStock,StationProductProfile:minThreshold,StationProductProfile:totalCapacity,StationProductProfile:maxFillCapacity">
        <StationProductInventory>
            <stationId>{0}</stationId>
            <as>var.inventory</as>
        </StationProductInventory>
        <StationProductProfile>
            <stationId>{0}</stationId>
            <productCode>var.inventory.productCode</productCode>
        </StationProductProfile>
    </Find>
</Query>
    `,
        FIND_STATIONS_BY_MULTIPLE_STATIONS_ID: `
    <Query>
        <Find nested="1" orderBy="Station.stationName">
            <Station>
                <sysId in="{0}"/>
            </Station>
        </Find>
    </Query>
    `,
        GET_STATION_AR_DATA: `
    <GetStationsARData>
    <date>{0}</date>
  </GetStationsARData>

  `,
        GET_VARIANCE_NOTIFICATION_LIMIT_DATA: `<Query>
    <Find>
        <StaticData>
            <type>Notification</type>
            <key>VarianceNotification</key>
        </StaticData>
    </Find>
    </Query>`,
        VERIFY_DAY_STOCK_LAST_FROM_AR: `
    <VerifyDaystockLastFromAR>
        <stationId>{0}</stationId>
        <productCode>{1}</productCode>
        <date>{2}</date>
        <changedQuantity>{3}</changedQuantity>
    </VerifyDaystockLastFromAR>
    `,
        GetPTOReqForStation: `<GetPTOReqForStation><stationId>{0}</stationId></GetPTOReqForStation>`
    },
    STATION_USER_MAPPING: {
        CREATE: `
    <Query>
        <Create>
            <CustomerStationUserMapping>
              <customerId>{1}</customerId>
              <stationId>{2}</stationId>
              <userName>{0}</userName>
            </CustomerStationUserMapping>
          </Create>
      </Query>
    `,
        DISASSOCIATE: `
      <Query>
          <DeleteAll>
              <CustomerStationUserMapping>
                  <stationId>{0}</stationId>
                      <userName>{1}</userName>
                </CustomerStationUserMapping>
            </DeleteAll>
        </Query>
  `
    },
    DELIVERY_WINDOW: {
        OBJECT_FIND: 'DeliveryWindow',
        FIND_ALL: `
         <Query>
            <find>
              <DeliveryWindow>
              <sysId ne=""/>
              </DeliveryWindow>
            </find>
        </Query>
        `,
        FIND_ALL_ACTIVE_BY_STATION_AND_DATE_RANGE: `
         <Query>
            <find>
              <DeliveryWindow>
                <stationId>{0}</stationId>
                <active>true</active>
                  <OR>
                     <StartDate>
                      <between>{1},{2}</between>
                     </StartDate>
                    <EndDate>
                      <between>{1},{2}</between>
                     </EndDate>
                   </OR>
              </DeliveryWindow>
            </find>
            <find>
              <DeliveryWindow>
                <stationId>{0}</stationId>
                <active>true</active>
                    <StartDate>
                        <le>{1}</le>
                       </StartDate>
                      <EndDate>
                        <ge>{2}</ge>
                       </EndDate>
              </DeliveryWindow>
            </find>
          </Query>
        `,
        FIND_ALL_ACTIVE: `
         <Query>
            <find>
              <DeliveryWindow>
                <sysId ne=""/>
                <active>true</active>
              </DeliveryWindow>
            </find>
        </Query>
        `,
        FIND_BY_DATE_RANGE: `
         <Query>
            <find>
              <DeliveryWindow>
                <sysId ne=""/>
                <active>true</active>
                <or>
                  <startTime>
                      <between>{0},{1}</between>
                  </startTime>
                  <endTime>
                      <between>{0},{1}</between>
                  </endTime>
                </or>
              </DeliveryWindow>
            </find>
        </Query>
        `,
        FIND_BY_ID: `
         <Query>
            <find>
              <DeliveryWindow>
                <sysId eq="{0}"/>
              </DeliveryWindow>
            </find>
        </Query>
        `,
        CREATE: `
<Javascript>
					var randomNumber= Math.floor(Math.random() * 10);
					sffContext.setProcessData("randomNumber" , ""+randomNumber);
				</Javascript>
    <Create>
      <DeliveryWindow>
        <stationId>{0}</stationId>
        <DeliveryWindowName>{1}</DeliveryWindowName>
        <StartDate>{2}</StartDate>
        <EndDate>{3}</EndDate>
        <startTime>{4}</startTime>
        <endTime>{5}</endTime>
        <maxMonthlyDeliveryDistribution>{6}</maxMonthlyDeliveryDistribution>
        <active>true</active>
        <Count>[:$ProcessData.randomNumber:]</Count>
      </DeliveryWindow>
    </Create>
    `,
        UPDATE: `
    <Update mode="unsafe">
       <DeliveryWindow>
            <sysId>{0}</sysId>
            <DeliveryWindowName>{1}</DeliveryWindowName>
            <StartDate>{2}</StartDate>
            <EndDate>{3}</EndDate>
            <startTime>{4}</startTime>
            <endTime>{5}</endTime>
            <maxMonthlyDeliveryDistribution>{6}</maxMonthlyDeliveryDistribution>
        </DeliveryWindow>
    </Update>
    `,
        DELETE: `
    <DeleteDeliveryWindowDetails>
      <DeliveryWindowId>{0}</DeliveryWindowId>
    </DeleteDeliveryWindowDetails>
    `
    },
    SYSTEM_SCHEDULE: {
        OBJECT_FIND: 'SystemSchedule',
        FIND_BY_ORDER_IDS: `
         <Query>
            <Find>
                <SystemSchedule>
                    <orderId in="{0}"></orderId>
                </SystemSchedule>
            </Find>
        </Query>
        `,
        FIND_BY_DATE_TIME: `
        <Query>
            <Find>
                <SystemSchedule>
                    <scheduleTime>{0}</scheduleTime>
                </SystemSchedule>
            </Find>
        </Query>
        `,
        FIND_COMBINATION_BY_ORDER_ID: `
        <Find nested="*">
             <SystemSchedule>
                <orderId>{0}</orderId>
                <truckId as="var.truckId" ne=""></truckId>
                <tripId as="var.tripId" ne=""></tripId>
                <StationId as="var.stationId" ne=""/>
            </SystemSchedule>
              <Truck>
                <SysId>var.truckId</SysId>
            </Truck>
            <TruckTrip>
                <SysId>var.tripId</SysId>
            </TruckTrip>
            <Station>
                <SysId>var.stationId</SysId>
            </Station>
        </Find>
        `,
        FIND_COMBINATION_BY_DATE_RANGE: `
        <Find nested="*">
            <TruckTrip>
                <scheduledTimeFrom>
<!--                    <OR>-->
                        <between>{0},{1}</between>
<!--                        <le>{0}</le>-->
<!--                    </OR>-->
                </scheduledTimeFrom>
<!--                <scheduledTimeTo>-->
<!--                    <OR>-->
<!--                        <between>{0},{1}</between>-->
<!--                        <ge>{1}</ge>-->
<!--                    </OR>-->
<!--                </scheduledTimeTo>-->
                <SysId as="var.tripId" ne=""/>
            </TruckTrip>
            <SystemSchedule>
                <tripId>var.tripId</tripId>
                <orderId as="var.orderId" ne=""/>
                <StationId as="var.stationId" ne=""/>
                <truckId as="var.truckId" ne=""></truckId>
            </SystemSchedule>
            <Station>
                <SysId>var.stationId</SysId>
            </Station>
            <Order>
                <SysId>var.OrderId</SysId>
            </Order>
             <Truck>
                <SysId>var.truckId</SysId>
            </Truck>
        </Find>
        `,
        FIND_COMBINATION_BY_DATE_RANGE_2: `
        <Find nested="*">
            <TruckTrip>
                 <and>
                    <scheduledTimeFrom>
                        <le>{0}</le>
                    </scheduledTimeFrom>
                    <scheduledTimeTo>
                        <ge>{1}</ge>
                    </scheduledTimeTo>
                </and>
                <SysId as="var.tripId" ne=""/>
            </TruckTrip>
            <SystemSchedule>
                <tripId>var.tripId</tripId>
                <orderId as="var.orderId" ne=""/>
                <StationId as="var.stationId" ne=""/>
                <truckId as="var.truckId" ne=""></truckId>
            </SystemSchedule>
            <Station>
                <SysId>var.stationId</SysId>
            </Station>
            <Order>
                <SysId>var.OrderId</SysId>
            </Order>
             <Truck>
                <SysId>var.truckId</SysId>
            </Truck>
        </Find>
        `,
        CREATE: `
        <Query>
            <Create>
                <SystemSchedule>
                    <ScheduleTime>[:$Now():]</ScheduleTime>
                    <stationId>{stationId}</stationId>
                    <orderId>{orderId}</orderId>
                    <tripId>{tripId}</tripId>
                    <truckId>{truckId}</truckId>
                    <dropNumber>{dropNumber}</dropNumber>
                </SystemSchedule>
            </Create>
	    </Query>
        `,
    },
    ORDER: {
        OBJECT_FIND: 'Order',
        OBJECT_ORDER_STATUS_HISTORY_FIND: 'OrderStatusHistory',
        FIND_ORDER_BY_ID: `<Query>
            <Find nested="*">
                <Order>
                    <sysid in="{0}"></sysid>
                </Order>
            </Find>
        </Query>`,
        FIND_ORDER_STATUS_HISTORY_BY_ID: `
        <Query>
            <Find orderBy="OrderStatusHistory.statusChangeTime">
                <OrderStatusHistory>
                    <orderId in="{0}"></orderId>
                </OrderStatusHistory>
            </Find>
        </Query>
        `,
        FIND_READY_FOR_SCHEDULE: `
        <Query>
            <Find nested="1">
                <Order>
                    <estimatedTime>
                        <ge>{0}</ge>
                    </estimatedTime>
                    <orderStatus in="Potential,OnHold,Approved,Rescheduled"/>
                </Order>
            </Find>
        </Query>
        `,
        REQUEST_CANCEL: `<CancelOrder>
            <stationId>{0}</stationId>
            <orderId>{1}</orderId>
            <userName>{2}</userName>
            <comment>{3}</comment>
        </CancelOrder>`,
        APPROVE_CANCEL: `
        <ApproveCancellationRequest>
            <stationId>{0}</stationId>
            <orderid>{1}</orderid>
            <userName>{2}</userName>
            <comment>Approved</comment>
        </ApproveCancellationRequest>
        `,
        RESCHEDULE: `
        <Query>
            <save mode="unsafe">
                <Order>
                    <sysId>{0}</sysId>
                    <estimatedTime>{1}</estimatedTime>
                    <timeWindow>{2}</timeWindow>
                    <userName>{3}</userName>
                    <orderStatus>{4}</orderStatus>
                    <remark>{5}</remark>
                    <lastUpdated>[:[:@RT:]$Now():]</lastUpdated>
                </Order>
            </save>
        </Query>
        `,
        OPTIMIZATION: `
        <OrderOptimizationSequenceAction>
            <date>{0}</date>
        </OrderOptimizationSequenceAction>
        `,
        EXPORT: `
        <SAPExportOrders>
            <startDate>{0}</startDate>
            <endDate>{1}</endDate>
        </SAPExportOrders>
        `,
        EXPORT_INVENTORY: `
        <ExportCurrentInventory>
            <StartTime>{0}</StartTime>
            <EndTime>{1}</EndTime>
        </ExportCurrentInventory>
        `,
        FIND_ALL_BY_STATIONS_BY_STATUSES_WITH_DATETIME_RANGE: `<Query>
            <Find nested="1" orderBy="Order.lastUpdated desc">
                <Order>
                    <stationId in="{0}"></stationId>
                    <estimatedTime><ge>{1}</ge><le>{2}</le></estimatedTime>
                </Order>
            </Find>
        </Query>`,
        FIND_ORDER_BY_STATION: `<Query>
            <Find nested="1" offset="{5}" limit="{6}" orderBy="Order.lastUpdated desc">
                <Order>
                    <stationId>{0}</stationId>
                    <estimatedTime>
                        <ge>{1}</ge>
                        <le>{2}</le>
                    </estimatedTime>
                    <orderStatus in="{3}"/>
                    <Source in="{4}"/>
                </Order>
            </Find>
        </Query>`,
        COUNT_ALL_ORDER_BY_STATION: `<Query>
            <Find>
                <Order>
                    <stationId>{0}</stationId>
                     <estimatedTime>
                        <ge>{1}</ge>
                        <le>{2}</le>
                    </estimatedTime>
                    <orderStatus in="{3}"/>
                </Order>
            </Find>
            <SetResponse>
                <Message>
                    <Value><count>[:$Response.Message.Value.Find/count(Result):]</count></Value>
                </Message>
            </SetResponse>
        </Query>`,
        UPLOAD_SAP_FILE: `
        <ManualSAPOrderLoad>
            <Base64Data>
                {Base64Data}
            </Base64Data>
            <filename>
                {filename}
            </filename>
            <extension>
                {extension}
            </extension>
        </ManualSAPOrderLoad>
        `,
        ORDER_FOR_UPDATE: `
        <Order>
            <orderId>{0}</orderId>
            <productCode>{1}</productCode>
            <revisedQuantity>{2}</revisedQuantity>
            <stationId>{3}</stationId>
            <estimatedTime>{4}</estimatedTime>
            <remark>{5}</remark>
        </Order>
                `,
        REVISE_ORDER_QUANTITY_FROM_AR: `
        <ReviseOrdersQuantityFromAR>
            <RevisedOrders>
                 {0}
            </RevisedOrders>
        </ReviseOrdersQuantityFromAR>`,
        FIND_STATION_BY_ESTIMATED_TIME: `
        <Query>
            <Find nested="1">
                <Order>
                    <estimatedTime><ge>{0}</ge><le>{1}</le></estimatedTime>
                </Order>
            </Find>
        </Query>`,
        CREATE_ORDER: `
        <CreateManualOrder>
            <salesOrderNumber>{0}</salesOrderNumber>
            <stationId>{1}</stationId>
            <estimatedTime>{2}</estimatedTime>
            <timeWindow>{3}</timeWindow>
            <orderStatus>Potential</orderStatus>
            <remark>{4}</remark>
            <source>System</source>
            <Items>{5}</Items>
        </CreateManualOrder>
    `,
        ORDER_ITEM: `
    <Item>
			<productCode>{0}</productCode>
			<quantity>{1}</quantity>
		</Item>
    `,
        UPDATE_PRODUCT_QUANTITY: `
    <Query>
    <Update mode="unsafe">
            {0}
            <Order>
                <sysId>{1}</sysId>
                <estimatedTime>{2}</estimatedTime>
                <timeWindow>{3}</timeWindow>
            </Order>
        </Update>
    </Query>
    `,
        ORDER_TO_BE_UPDATE: `
    <OrderItem>
        <sysId>{0}</sysId>
        <quantity>{1}</quantity>
    </OrderItem>
    `,
        ORDER_FOR_APPROVING: `
    <Order>
            <orderId>{0}</orderId>
            <remark>Planner approved</remark>
        </Order>
    `,
        APPROVE_ORDER: `
    <OrdersApprovalFromAR>
    <ApprovedOrders>
       {0}
    </ApprovedOrders>
</OrdersApprovalFromAR>
    `,
        ImportManualAndCNIOrders: `
            <ImportManualAndCNIOrders>
                <Base64Data>{0}</Base64Data>
            </ImportManualAndCNIOrders>
        `
    },
    REPORT: {
        OBJECT_FIND: 'Report',
        FIND_ALL: `
        <Query>
            <Find>
              <Report>
                <sysId ne=""></sysId>
              </Report>
            </Find>
        </Query>
      `,
        GENERATE: `
        <GenerateReport>
            <ReportId>{0}</ReportId>
            <StartDate>{1}</StartDate>
            <EndDate>{2}</EndDate>
          </GenerateReport>
        `
    },
    TRIP: {
        GET_TRIP_DETAILS_BY_ID:
            `
    <GetTripDetailsById>
      <tripId>{0}</tripId>
    </GetTripDetailsById>
    `,
        ASSOCIATE_ORDER:
            `
    <AssociateOrderToTrip>
	<AssociationData>
		<tripId>{0}</tripId>
		<Compartments>
		{1}
		</Compartments>
		<VerifyAndAssociate>{2}</VerifyAndAssociate>
	</AssociationData>
</AssociateOrderToTrip>
    `,
        DISASSOCIATE_ORDER: `
    <DisassociateOrderFromTrip>
      <tripId>{0}</tripId>
      <scheduleId>{1}</scheduleId>
    </DisassociateOrderFromTrip>
    `,
        DIVERT_ORDER: `
    <DivertOrderFromTrip>
	<DiversionData>
		<tripId>{0}</tripId>
		<orderIdToDivert>{1}</orderIdToDivert>
		<Compartments>
			{2}
		</Compartments>
		<VerifyAndDivert>{3}</VerifyAndDivert>
	</DiversionData>
</DivertOrderFromTrip>
    `,
        GET_COMPARTMENT_BY_ORDER: `
    <GetAllCompartmentsForOrderDiversion>
	<tripId>{0}</tripId>
	<OrderIdToDivert>{1}</OrderIdToDivert>
</GetAllCompartmentsForOrderDiversion>
    `
    },
    NOTIFICATION: {
        OBJECT_FIND: 'Notification',
        FIND_FOR_ADMIN: `
      <Query>
        <Find limit="{0}" orderBy="var.datetime desc">
          <NotificationRoleMapping>
            <roleName>Admin</roleName>
            <as>var.mapping</as>
          </NotificationRoleMapping>
          <Notification>
            <domainName>var.mapping.domainName</domainName>
            <priority>var.mapping.notificationPriority</priority>
            <readingTime ne="" as="var.datetime"/>
          </Notification>
        </Find>
      </Query>
      `,
        FIND_FOR_PLANNER: `
      <Query>
      <Find limit="{0}" orderBy="var.datetime desc">
        <NotificationRoleMapping>
          <roleName>Planner</roleName>
          <as>var.mapping</as>
        </NotificationRoleMapping>
        <Notification>
          <domainName>var.mapping.domainName</domainName>
          <priority>var.mapping.notificationPriority</priority>
          <readingTime ne="" as="var.datetime"/>
        </Notification>
      </Find>
    </Query>
      `,
        FIND_FOR_CUSTOMER: `
      <Query>
        <Find limit="{0}" orderBy="var.datetime desc">
          <NotificationRoleMapping>
            <roleName>Customer</roleName>
            <as>var.mapping</as>
          </NotificationRoleMapping>
          <Notification>
            <domainName>var.mapping.domainName</domainName>
            <priority>var.mapping.notificationPriority</priority>
            <entityId in="{1}"></entityId>
            <readingTime ne="" as="var.datetime"/>
          </Notification>
        </Find>
      </Query>
      `,
        FIND_FOR_TRUCK_OWNER_OPERATOR: `
      <Query>
        <Find limit="{0}" orderBy="var.datetime desc">
          <NotificationRoleMapping>
            <roleName>TruckCompanyOwner</roleName>
            <as>var.mapping</as>
          </NotificationRoleMapping>
          <Notification>
            <domainName>var.mapping.domainName</domainName>
            <priority>var.mapping.notificationPriority</priority>
            <entityId in="{1}"></entityId>
            <readingTime ne="" as="var.datetime"/>
          </Notification>
        </Find>
      </Query>
      `,
        FIND_ALL: `
    <Find Limit="{0}" Offset="0" orderBy="Notification.readingTime desc">
        <Notification>
            <stationId ne=""/>
        </Notification>
    </Find>
    `,
        FIND_ALL_WITH_OPTIONS: `
    <Find Limit="{0}" Offset="{1}" orderBy="Notification.{2} {3}">
    `,
        FIND_BY_STATIONS: `
    <Find Limit="{1}" orderBy="Notification.readingTime desc">
        <Notification>
            <stationId in="{0}"/>
        </Notification>
    </Find>
    `,
        FIND_BY_NOTIFICATION_ID: `
    <Find>
        <Notification>
            <sysId eq="{0}"/>
        </Notification>
    </Find>
    `,
        DELETE_BY_NOTIFICATION_ID: `
    <DeleteAll>
        <Notification>
            <sysId eq="{id}"/>
        </Notification>
    </DeleteAll>
    `
    },
    ROUTE: {
        FIND_ALL: `<GetStationRoutes><stationId>{0}</stationId></GetStationRoutes>`,
        FIND_BY_ID: `<GetRouteDetails><routeId>{0}</routeId></GetRouteDetails>`,
        CREATE: `
        <CreateRoute>
            <StationId>{0}</StationId>
            <RouteName>{1}</RouteName>
            <Active>{2}</Active>
            <Description>{3}</Description>
            <OriginType>{4}</OriginType>
            <Origin>{5}</Origin>
            <DestinationType>{6}</DestinationType>
            <Destination>{7}</Destination>
            <EscortRequired>{8}</EscortRequired>
            <geofencePoints>{9}</geofencePoints>
        </CreateRoute>
    `,
        UPDATE: `
        <UpdateRoute>
            <RouteId>{0}</RouteId>
            <RouteName>{1}</RouteName>
            <Active>{2}</Active>
            <Description>{3}</Description>
            <OriginType>{4}</OriginType>
            <Origin>{5}</Origin>
            <DestinationType>{6}</DestinationType>
            <Destination>{7}</Destination>
            <EscortRequired>{8}</EscortRequired>
            <geofencePoints>{9}</geofencePoints>
        </UpdateRoute>
    `,
        DELETE: `<DeleteRoute><routeId>{0}</routeId></DeleteRoute>`,
        DELETE_WAY_POINTS: `<DeleteRouteGeoFencePoints><routeId>{0}</routeId></DeleteRouteGeoFencePoints>`
    },
    OTHERS: {
        SEND_ALERT_MAIL: `
    <Query>
      <SendChevronAlertMail>
          <userName>{userName}</userName>
          <subject>{subject}</subject>
          <message>{message}</message>
      </SendChevronAlertMail>
    </Query>
    `
    },
    getSystemSchedule: `<GetSystemSchedule><startTimeStamp>{0}</startTimeStamp><endTimeStamp>{1}</endTimeStamp></GetSystemSchedule>`,
    getTripDetailsById: `<GetTripDetailsById><tripId>{0}</tripId></GetTripDetailsById>`,
    deleteTripById: `<DeleteTripById><tripId>{0}</tripId></DeleteTripById>`,
    updateTripInfo: `<Query><UpdateOrderSchedule><tripId>{0}</tripId>{1}</UpdateOrderSchedule></Query>`,
    updateScheduleInfo: `<Query><UpdateOrderSchedule><systemScheduleId>{0}</systemScheduleId><destinationArrivalTime>{1}</destinationArrivalTime></UpdateOrderSchedule></Query>`,
    updateTripStatus: `<UpdateTripStatusManually><tripId>{0}</tripId><tripStatus>{1}</tripStatus></UpdateTripStatusManually>`,
    updateTripStatusWithStation: `<UpdateTripStatusManually><tripId>{0}</tripId><tripStatus>{1}</tripStatus><scheduleId>{2}</scheduleId></UpdateTripStatusManually>`,
    updateOrderStatus: `<UpdateOrderStatusManually><orderId>{0}</orderId><orderStatus>{1}</orderStatus></UpdateOrderStatusManually>`,
    settings: {
        findAllParams: `<Query><FindAllSysParams/></Query>`,
        findAllOrgProfileParams: `<Query><FindAllOrgProfileParams/></Query>`,
        findParamsByCategory: `<Query><FindAllSysParams><Category>{0}</Category></FindAllSysParams></Query>`,
        createParameter: `<Query><Create><SystemVariables><VarCategory>{0}</VarCategory><varName>{1}</varName><VarValueType>{2}</VarValueType><VarValue>{3}</VarValue></SystemVariables></Create></Query>`,
        updateParameter: `
            <Query>
                <EditSysParams>
                    <sVarId>{0}</sVarId>
                    <VarCategory>{1}</VarCategory>
                    <VarName>{2}</VarName>
                    <VarDescription>{3}</VarDescription>
                    <VarKeyType>{4}</VarKeyType>
                    <VarKey>{5}</VarKey>
                    <VarValueType>{6}</VarValueType>
                    <VarValue>{7}</VarValue>
                </EditSysParams>
            </Query>
    `,
        getIcon: `<GetIcon><IconType>{0}</IconType></GetIcon>`,
        uploadIcon: `<UploadIcon><IconType>{0}</IconType><Base64Data>{1}</Base64Data></UploadIcon>`,
        listAllProducts: `<ListAllProducts></ListAllProducts>`,
        getProductTypeData: `<getProductTypeData><ProductId>{0}</ProductId></getProductTypeData>`,
        createProduct: `<createProduct><productCode>{0}</productCode><description>{1}</description><colorCode>{2}</colorCode><baseProducts>{3}</baseProducts></createProduct>`,
        deleteProduct: `<DeleteProduct><sysId>{0}</sysId></DeleteProduct>`,
        updateProductDetail: `<UpdateProduct>
                <ProductId>{0}</ProductId>
                <productCode>{1}</productCode>
                <description>{2}</description>
                <colorcode>{3}</colorcode>
                <baseProducts>{4}</baseProducts>
        </UpdateProduct>
        `,
        deleteAllBaseProductsInProduct: `<DeleteBaseProducts><productId>{0}</productId></DeleteBaseProducts>`,
        listAllBaseProducts: `<ListAllBaseProducts></ListAllBaseProducts>`,
        createBaseProduct: `<CreateBaseProduct><baseProductCode>{0}</baseProductCode><productCategory>{1}</productCategory><description>{2}</description><colorCode>{3}</colorCode></CreateBaseProduct>`,
        updateBaseProduct: `<UpdateBaseProduct>
            <BaseProductId>{0}</BaseProductId>
            <BaseProductCode>{1}</BaseProductCode>
            <ColorCode>{2}</ColorCode>
            <Description>{3}</Description>
            <ProductCategory>{4}</ProductCategory>
        </UpdateBaseProduct>
        `,
        deleteBaseProduct: `<deleteBaseProduct><sysId>{0}</sysId></deleteBaseProduct>`,
        orderImportProductMapping: {
            create: `<Query>
                <Create>
                    <SAPAtmosProductMapping>
                        <productFromSAP>{0}</productFromSAP>
                        <productInATMOS>{1}</productInATMOS>
                        <remark>{2}</remark>
                    </SAPAtmosProductMapping>
                </Create>
            </Query>`,
            list: `<Query><Find><SAPAtmosProductMapping><Sysid ne=""/></SAPAtmosProductMapping></Find></Query>`,
            update: `<Query>
                <Update mode="unsafe">
                    <SAPAtmosProductMapping>
                        <sysid>{0}</sysid>
                        <productInATMOS>{1}</productInATMOS>
                        <productFromSAP>{2}</productFromSAP>
                        <remark>{3}</remark>
                        <LastUpdated>[:[:@RT:]$Now():]</LastUpdated>
                    </SAPAtmosProductMapping>
                </Update>
            </Query>`,
            delete: `<Query><DeleteAll><SAPAtmosProductMapping>
            <sysid>{0}</sysid>
        </SAPAtmosProductMapping></DeleteAll></Query>`
        }
    },
    activityManagement: {
        getAllActivityDetails: `<GetAllActivityDetails><StartTimeStamp>{0}</StartTimeStamp><EndTimeStamp>{1}</EndTimeStamp></GetAllActivityDetails>`,
        getAllAnalyticArtifacts: `<GetAllAnalyticArtifacts><StartTimeStamp>{0}</StartTimeStamp><EndTimeStamp>{1}</EndTimeStamp></GetAllAnalyticArtifacts>`,
        getAllIntigratedServiceDetails: `<GetAllIntigratedServiceDetails></GetAllIntigratedServiceDetails>`,
        getIntigratedServiceDetails: `<GetIntigratedServiceDetails><IntigratedServiceName>{0}</IntigratedServiceName><ServiceFeature>{1}</ServiceFeature><StartTimeStamp>{2}</StartTimeStamp><EndTimeStamp>{3}</EndTimeStamp></GetIntigratedServiceDetails>`,
        getServiceConnectionHistory: `<GetServiceConnectionHistory><IntigratedServiceName>{0}</IntigratedServiceName><ServiceFeature>{1}</ServiceFeature><StartTimeStamp>{2}</StartTimeStamp><EndTimeStamp>{3}</EndTimeStamp></GetServiceConnectionHistory>`,
        exportServiceconnectionhistorydata: `<ExportServiceconnectionhistorydata><IntigratedServiceName>{0}</IntigratedServiceName><ServiceFeature>{1}</ServiceFeature><StartTimeStamp>{2}</StartTimeStamp><EndTimeStamp>{3}</EndTimeStamp></ExportServiceconnectionhistorydata>`,
        exportexternalServicedata: `<ExportexternalServicedata><IntigratedServiceName>{0}</IntigratedServiceName><ServiceFeature>{1}</ServiceFeature><StartTimeStamp>{2}</StartTimeStamp><EndTimeStamp>{3}</EndTimeStamp></ExportexternalServicedata>`
    },
    dischargePoints: {
        showDischargePoints: `<ShowDischargePoints><stationId>{0}</stationId></ShowDischargePoints>`,
        createDischargePoint: `<CreateDischargePoint>
            <DischargePointName>{0}</DischargePointName>
            <DischargepointIndex>{1}</DischargepointIndex>
            <Longitude>{2}</Longitude>
            <Latitude>{3}</Latitude>
            <Altitude>{4}</Altitude>
            <TankAssociations>{5}</TankAssociations>
            <stationId>{6}</stationId>
        </CreateDischargePoint>
        `,
        updateDischargePoint: `<EditDischargePoint>
            <DischargePointId>{0}</DischargePointId>
            <DischargePointName>{1}</DischargePointName>
            <DischargepointIndex>{2}</DischargepointIndex>
            <Longitude>{3}</Longitude>
            <Latitude>{4}</Latitude>
            <Altitude>{5}</Altitude>
            <TankAssociations>{6}</TankAssociations>
        </EditDischargePoint>
        `,
        deleteDischargePoint: `<DeleteDischargePoint><DischargePointId>{0}</DischargePointId></DeleteDischargePoint>`,
        deleteDischargePointTankRef: `<DeleteDischargePointTankAssociations><DischargePointId>{0}</DischargePointId></DeleteDischargePointTankAssociations>`
    }
};

