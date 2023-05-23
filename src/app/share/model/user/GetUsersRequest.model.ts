import {RequestInfo} from "../common/RequestInfo.model";

export class GetUsersRequest {
  keyword?: string;
  requestInfo?: RequestInfo;

  constructor(keyword: string, requestInfo: RequestInfo) {
    this.keyword = keyword;
    this.requestInfo = requestInfo;
  }
}
