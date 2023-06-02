import {RequestInfo} from "../common/request-info.model";
import {Role} from "../../constant/role.constant";

export class GetUsersRequest {
  requestInfo?: RequestInfo;
  keyword?: string;
  private role?: string[];
  isActive?: boolean;
  isExcludeCurrentUserLogged?: boolean;
  isDeleted?: boolean;
  fromDate?: Date;
  toDate?: Date;

  constructor(requestInfo?: RequestInfo) {
    this.requestInfo = requestInfo ? requestInfo : new RequestInfo(null, null, null);
  }


  get getRole(): string[] {
    return this.role;
  }

  set setRole(value: string[]) {
    if(value && (value.length !== 0)) {
      if(typeof value === "string"){
        value = Array.of(value);
      }

      let rolesEnum = Object.keys(Role);
      value = value.filter(role => rolesEnum.includes(role));
    } else {
      value = null;
    }

    this.role = value;
  }
}
