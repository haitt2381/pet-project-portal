import {DEFAULT_PAGE, DEFAULT_SIZE} from "../../../app.constant";

export class RequestInfo {
  page: number
  size: number
  sortInfo: SortInfo[]

  constructor(page: number, size: number, sortInfo: SortInfo) {
    this.page = page ? page : DEFAULT_PAGE;
    this.size = size ? size : DEFAULT_SIZE;
    this.sortInfo = sortInfo ? Array.of(sortInfo) : Array.of(new SortInfo("2", "modifiedAt"));
  }
}

export class SortInfo {
  direction: string
  field: string

  constructor(direction: string, field: string) {
    this.direction = '0';
    if(direction) {
      this.direction = direction === 'desc' ? "2" : "1";
    }
    this.field = field ? field : "modifiedAt";
  }
}
