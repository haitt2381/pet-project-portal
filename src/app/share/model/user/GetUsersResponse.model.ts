import {User} from "./user.model";
import {ResponseInfo} from "../common/ResponseInfo.model";

export interface GetUsersResponse {
  responseInfo?: ResponseInfo;
  data?: User[];
}
