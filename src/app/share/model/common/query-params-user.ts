export interface QueryParamsUser {
  pageSize: number
  pageIndex: number
  sortActive: string
  sortDirection: any;
  role: string[]
  active: boolean
  fromDate: Date;
  toDate: Date;
  keyword: string;
}
