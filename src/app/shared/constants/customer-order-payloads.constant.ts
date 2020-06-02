export const CustomerOrderPayloadsConstant = {
    CUSTOMER_ORDERS: {
        OBJECT_FIND: 'Order',
        GET_UPCOMING_ORDER_BY_STATION_ID:
            `<Query>
            <Find nested="1" Limit="1" orderBy="Order.estimatedTime">
                <Order>
                <stationId>{0}</stationId>
                    <estimatedTime>
                        <ge>[:[:@RT:]$Now():]</ge>
                    </estimatedTime>
                </Order>
            </Find>
        </Query>
        `,
        GET_HISTORICAL_ORDER_BY_STATION_ID:
            `<Query>
            <Find nested="1" orderBy="Order.lastUpdated">
                <Order>
                    <stationId>{0}</stationId>
                    <orderStatus><ne>Potential</ne></orderStatus>
                    <deliveredTime><ge>{1}</ge><le>{2}</le></deliveredTime>
                </Order>
            </Find>
        </Query>`,
        GET_HISTORICAL_NOT_POTENTIAL_ORDER_BY_MULTIPLE_STATION:
            `<Query>
            <Find nested="1" orderBy="Order.lastUpdated">
                <Order>
                    <stationId in="{0}"></stationId>
                    <orderStatus><ne>Potential</ne></orderStatus>
                    <deliveredTime><ge>{1}</ge><le>{2}</le></deliveredTime>
                </Order>
            </Find>
        </Query>`,
        CANCEL_ORDER:
            `<CancelOrder>
            <stationId>{0}</stationId>
            <orderId>{1}</orderId>
            <userName>{2}</userName>
            <comment>{3}</comment>
        </CancelOrder>`,
    },
    ORDER_SUMMARY: {
        OBJECT_STATION_ORDER_SUMMARY: 'OrderSummary',
        OBJECT_STATION_PRODUCT_ORDER_SUMMARY: 'StationData',
        GET_ORDER_SUMMARY:
            `<StationOrderSummary>
            <StationName>{0}</StationName>
            <StartTime>{1}</StartTime>
            <EndTime>{2}</EndTime>
        </StationOrderSummary>`,
        GET_PRODUCT_ORDER_SUMMARY:
            `<GetProductOrderQuantityForTime>
            <StationId>{0}</StationId>
            <StartTime>{1}</StartTime>
            <EndTime>{2}</EndTime>
        </GetProductOrderQuantityForTime>`,
    }
};
