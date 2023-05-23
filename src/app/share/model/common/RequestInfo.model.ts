export class RequestInfo {
  page: number
  size: number
  sortInfo: SortInfo[]

  constructor(page: number, size: number, sortInfo: SortInfo[]) {
    this.page = page;
    this.size = size;
    this.sortInfo = sortInfo;
  }
}

export class SortInfo {
  direction: string
  field: string

  constructor(direction: string, field: string) {
    this.direction = direction;
    this.field = field;
  }
}
