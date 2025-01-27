export interface PlayerInfo {
  aid: number
  bvid: string
  allow_bp: boolean
  no_share: boolean
  cid: number
  max_limit: number
  page_no: number
  has_next: boolean
  ip_info: Ipinfo
  login_mid: number
  login_mid_hash: string
  is_owner: boolean
  name: string
  permission: string
  level_info: Levelinfo
  vip: Vip
  answer_status: number
  block_time: number
  role: string
  last_play_time: number
  last_play_cid: number
  now_time: number
  online_count: number
  need_login_subtitle: boolean
  subtitle: Subtitle
  view_points: Viewpoint[]
  preview_toast: string
  options: Options
  guide_attention: Guideattention[]
  jump_card: any[]
  operation_card: any[]
  online_switch: Onlineswitch
  fawkes: Fawkes
  show_switch: Showswitch
  bgm_info: Bgminfo
  toast_block: boolean
  is_upower_exclusive: boolean
  is_upower_play: boolean
  is_ugc_pay_preview: boolean
  elec_high_level: Elechighlevel
  disable_show_up_info: boolean
}
interface Elechighlevel {
  privilege_type: number
  title: string
  sub_title: string
  show_button: boolean
  button_text: string
  jump_url: string
  intro: string
  new: boolean
}
interface Bgminfo {
  music_id: string
  music_title: string
  jump_url: string
}
interface Showswitch {
  long_progress: boolean
}
interface Fawkes {
  config_version: number
  ff_version: number
}
interface Onlineswitch {
  enable_gray_dash_playback: string
  new_broadcast: string
  realtime_dm: string
  subtitle_submit_switch: string
}
interface Guideattention {
  type: number
  from: number
  to: number
  pos_x: number
  pos_y: number
}
interface Options {
  is_360: boolean
  without_vip: boolean
}
export interface Viewpoint {
  type: number
  from: number
  to: number
  content: string
  imgUrl: string
  logoUrl: string
  team_type: string
  team_name: string
}
interface Subtitle {
  allow_submit: boolean
  lan: string
  lan_doc: string
  subtitles: any[]
}
interface Vip {
  type: number
  status: number
  due_date: number
  vip_pay_type: number
  theme_type: number
  label: Label
  avatar_subscript: number
  nickname_color: string
  role: number
  avatar_subscript_url: string
  tv_vip_status: number
  tv_vip_pay_type: number
  tv_due_date: number
  avatar_icon: Avataricon
}
interface Avataricon {
  icon_resource: Iconresource
}
interface Iconresource {
}
interface Label {
  path: string
  text: string
  label_theme: string
  text_color: string
  bg_style: number
  bg_color: string
  border_color: string
  use_img_label: boolean
  img_label_uri_hans: string
  img_label_uri_hant: string
  img_label_uri_hans_static: string
  img_label_uri_hant_static: string
}
interface Levelinfo {
  current_level: number
  current_min: number
  current_exp: number
  next_exp: number
  level_up: number
}
interface Ipinfo {
  ip: string
  zone_ip: string
  zone_id: number
  country: string
  province: string
  city: string
}
