import {ResponseInfo} from "../common/response-info.model";
import {User} from "./user.model";

export class GetUserResponse {
  responseInfo?: ResponseInfo;
  data?: User;
}
