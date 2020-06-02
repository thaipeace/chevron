export const InventoryPayloadsConstant = {
    INVENTORY: {
        OBJECT_FIND: 'StationProductInventoryHistory',
        GET_INVENTORY_BY_STATION_ID:
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
        </Query>`,
        GET_INVENTORY_BY_MULTILE_STATION:
        `<Query>
            <Find>
                <StationProductInventoryHistory>
                    <stationId in="{0}"></stationId>
                    <readingTime>
                        <ge>{1}</ge>
                        <le>{2}</le>
                    </readingTime>
                </StationProductInventoryHistory>
            </Find>
        </Query>`,
    },
};
