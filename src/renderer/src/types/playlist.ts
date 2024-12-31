export interface VideoPlayerData {
  bvid: string
  aid: number
  videos: number
  tid: number
  tid_v2: number
  tname: string
  tname_v2: string
  copyright: number
  pic: string
  title: string
  pubdate: number
  ctime: number
  desc: string
  desc_v2: Descv2[]
  state: number
  duration: number
  rights: Rights
  owner: Owner
  stat: Stat
  argue_info: Argueinfo
  dynamic: string
  cid: number
  dimension: Dimension
  premiere?: any
  teenage_mode: number
  is_chargeable_season: boolean
  is_story: boolean
  is_upower_exclusive: boolean
  is_upower_play: boolean
  is_upower_preview: boolean
  enable_vt: number
  vt_display: string
  no_cache: boolean
  pages: Song[]
  subtitle?: any
  is_season_display: boolean
  user_garb: Usergarb
  honor_reply: Honorreply
  like_icon: string
  need_jump_bv: boolean
  disable_show_up_info: boolean
  is_story_play: number
  is_view_self: boolean
}
interface Honorreply {
}
interface Usergarb {
  url_image_ani_cut: string
}
export interface Song {
  cid: number
  page: number
  from: string
  part: string
  duration: number
  vid: string
  weblink: string
  dimension: Dimension
  first_frame: string
}
interface Dimension {
  width: number
  height: number
  rotate: number
}
interface Argueinfo {
  argue_msg: string
  argue_type: number
  argue_link: string
}
interface Stat {
  aid: number
  view: number
  danmaku: number
  reply: number
  favorite: number
  coin: number
  share: number
  now_rank: number
  his_rank: number
  like: number
  dislike: number
  evaluation: string
  vt: number
}
interface Owner {
  mid: number
  name: string
  face: string
}
interface Rights {
  bp: number
  elec: number
  download: number
  movie: number
  pay: number
  hd5: number
  no_reprint: number
  autoplay: number
  ugc_pay: number
  is_cooperation: number
  ugc_pay_preview: number
  no_background: number
  clean_mode: number
  is_stein_gate: number
  is_360: number
  no_share: number
  arc_pay: number
  free_watch: number
}
interface Descv2 {
  raw_text: string
  type: number
  biz_id: number
}
