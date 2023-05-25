export interface ResponseInfo {
  page: any
  size: any
  total: any
  errors: Error[]
}

export interface Error {
  code: string
  message: string
}
