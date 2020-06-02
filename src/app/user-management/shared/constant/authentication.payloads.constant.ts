import {DEFAULT_ROLES} from '@app/user-management/shared/models/data.models/user.model';

export const AuthenticationPayloadsConstant = {
  USER: {
    OBJECT_FIND: 'User',
    CREATE: `
    <AtmosCreateUser>
        <firstName>{firstName}</firstName>
        <lastName>{lastName}</lastName>
        <emailId>{emailId}</emailId>
        <roleId>{roleId}</roleId>
    </AtmosCreateUser>
    `,
    UPDATE: `
    <Save mode="unsafe">
      <User>
        <firstName>{firstName}</firstName>
        <lastName>{lastName}</lastName>
        <userName>{userName}</userName>
        <emailId>{emailId}</emailId>
        <lastUpdated>[:$Now():]</lastUpdated>
      </User>
    </Save>
    `,
    FIND_BY_USERNAME: `
    <find  only="username,firstname, lastname, emailId, roleid">
        <User>
            <username>Admin</username>
        </User>
    </find>
    `,
    FIND_ALL: `
     <find>
        <User>
            <username ne=""/>
        </User>
    </find>
    `,
    CHANGE_PASSWORD: `
    <ChangePassword>
        <userName>{userName}</userName>
        <oldPassword>{oldPassword}</oldPassword>
        <password>{password}</password>
    </ChangePassword>
    `,
    RESET_PASSWORD: `
      <ResetPassword>
          <userName>{userName}</userName>
      </ResetPassword>
    `,
    DELETE: `
    <DeleteUser>
      <username>{userName}</username>
    </DeleteUser>
    `,
    LOCK:
    `<Query>
      <Save mode="unsafe">
        <User>
          <SysId>{sysId}</SysId>
          <isLocked>{isLocked}</isLocked>
        </User>
      </Save>
    </Query>`,
    UPDATE_DP:
    `<UpdateUserDP>
        <username>{username}</username>
        <DPCode>{code}</DPCode>
    </UpdateUserDP>`,
    GET_DP:
    `<GetUserDP>
      <username>{0}</username>
    </GetUserDP>`
  },
  ROLE: {
    OBJECT_FIND: 'Role',
    CREATE: `
      <Create>
          <Role>
              <SysId>OperatorRoleId</SysId>
              <roleName>Operator</roleName>
              <description>Operator</description>
              <createDate>[:$Now():]</createDate>
          </Role>
      </Create>
    `,
    FIND_BY_ID: `
  <find>
      <role>
          <sysid>${DEFAULT_ROLES.ADMIN}</sysid>
      </role>
  </find>
  `,
      FIND_ALL: `
     <find>
        <Role>
            <sysid ne=""/>
        </Role>
    </find>
    `
  },
};
