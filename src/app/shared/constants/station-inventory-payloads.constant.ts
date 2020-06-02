export const StationInventoryPayloads = {
  INVENTORY: {
    OBJECT_FIND: 'StationInventory',
    UPDATE_TANK_INVENTORY: `
        <UpdateStationInventory>
          <userName>{userName}</userName>
            <stationId>{stationId}</stationId>
            <tanks>
                {tanks}
            </tanks>
            <comment>{comment}</comment>
        </UpdateStationInventory>
        `
  },
  INVENTORY_PRODUCT_PROFILE: {
    OBJECT_FIND: 'Station',
    FIND_INVENTORY_PRODUCT_PROFILE:
      `<Query>
        <Find as="Station:Product:$None" only="StationProductInventory:productCode,StationProductInventory:stationId,StationProductInventory:totalQuantity,StationProductInventory:totalUllage,StationProductInventory:lastUpdated,StationProductProfile:deadStock,StationProductProfile:minThreshold,StationProductProfile:totalCapacity,StationProductProfile:maxFillCapacity">
            <StationProductInventory>
                <stationId>{0}</stationId>
                <as>var.inventory</as>
            </StationProductInventory>
            <StationProductProfile>
                <stationId>{0}</stationId>
                <productCode>var.inventory.productCode</productCode>
            </StationProductProfile>
        </Find>
    </Query>`,
  }
};
