export interface PlayUrl {
  from: string
  result: string
  message: string
  quality: number
  format: string
  timelength: number
  accept_format: string
  accept_description: string[]
  accept_quality: number[]
  video_codecid: number
  seek_param: string
  seek_type: string
  dash: Dash
  support_formats: Supportformat[]
  high_format?: any
  last_play_time: number
  last_play_cid: number
  view_info?: any
}
interface Supportformat {
  quality: number
  format: string
  new_description: string
  display_desc: string
  superscript: string
  codecs: string[]
}
interface Dash {
  duration: number
  minBufferTime: number
  min_buffer_time: number
  video: Video[]
  audio: Video[]
  dolby: Dolby
  flac?: Flac
}
interface Flac {
  display: boolean
  audio: Video | null
}
interface Dolby {
  type: number
  audio?: any
}
interface Video {
  id: number
  baseUrl: string
  base_url: string
  backupUrl: string[]
  backup_url: string[]
  bandwidth: number
  mimeType: string
  mime_type: string
  codecs: string
  width: number
  height: number
  frameRate: string
  frame_rate: string
  sar: string
  startWithSap: number
  start_with_sap: number
  SegmentBase: SegmentBase
  segment_base: Segmentbase
  codecid: number
}
interface Segmentbase {
  initialization: string
  index_range: string
}
interface SegmentBase {
  Initialization: string
  indexRange: string
}
