import {APP_DEFAULT_PAGE_INDEX, APP_DEFAULT_PAGE_SIZE} from "../../../app.constant";

export class RequestInfo {
  page: number
  size: number
  sortInfo: SortInfo[]

  constructor(page: number, size: number, sortInfo: SortInfo) {
    this.page = page ? page : APP_DEFAULT_PAGE_INDEX;
    this.size = size ? size : APP_DEFAULT_PAGE_SIZE;
    this.sortInfo = sortInfo ? Array.of(sortInfo) : Array.of(new SortInfo("2", "modifiedAt"));
  }
}

export class SortInfo {
  direction: string
  field: string

  constructor(direction: string, field: string) {
    this.direction = '0';
    if (direction) {
      this.direction = direction === 'desc' ? "2" : "1";
    }
    this.field = field ? field : "modifiedAt";
  }
}
