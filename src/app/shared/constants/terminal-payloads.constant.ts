export const TerminalPayloadsConstant = {
    TERMINAL: {
        OBJECT_FIND: 'Terminal',
        GET_TERMINALS: `
        <Query>
            <Find nested="1">
                <Terminal>
                    <sysId ne=""/>
                </Terminal>
            </Find>
        </Query>
        `
    }
};
