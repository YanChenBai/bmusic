export interface Resp<T> {
  data: T
  ttl?: number
  code: number
  message?: string
}
