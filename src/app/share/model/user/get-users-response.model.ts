import {User} from "./user.model";
import {ResponseInfo} from "../common/response-info.model";

export interface GetUsersResponse {
  responseInfo?: ResponseInfo;
  data?: User[];
}
