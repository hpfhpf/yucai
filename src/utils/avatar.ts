// 内置头像工具：头像值以 `fa:图标名` 形式存储于用户 avatarUrl 字段
// 前端检测 `fa:` 前缀渲染 FontAwesome 图标，否则当作图片 URL

export interface PresetAvatar {
  icon: string // FontAwesome solid 图标名（不含 fa- 前缀）
  bg: string   // 圆形底色
}

// 精选一组 FontAwesome Free (solid) 图标作为内置头像
export const PRESET_AVATARS: PresetAvatar[] = [
  { icon: 'user-astronaut', bg: '#1e5bff' },
  { icon: 'user-ninja', bg: '#2b2f3a' },
  { icon: 'user-secret', bg: '#5b6472' },
  { icon: 'user-tie', bg: '#0f766e' },
  { icon: 'user-graduate', bg: '#7c3aed' },
  { icon: 'user-doctor', bg: '#0ea5e9' },
  { icon: 'cat', bg: '#f59e0b' },
  { icon: 'dog', bg: '#b45309' },
  { icon: 'dragon', bg: '#dc2626' },
  { icon: 'crow', bg: '#334155' },
  { icon: 'horse', bg: '#92400e' },
  { icon: 'otter', bg: '#a16207' },
  { icon: 'frog', bg: '#16a34a' },
  { icon: 'robot', bg: '#0891b2' },
  { icon: 'ghost', bg: '#8b5cf6' },
  { icon: 'crown', bg: '#eab308' },
  { icon: 'rocket', bg: '#ef4444' },
  { icon: 'star', bg: '#f97316' },
  { icon: 'heart', bg: '#ec4899' },
  { icon: 'fire', bg: '#f43f5e' },
  { icon: 'leaf', bg: '#22c55e' },
  { icon: 'moon', bg: '#4338ca' },
  { icon: 'chess-knight', bg: '#475569' },
  { icon: 'paw', bg: '#d97706' },
]

const FA_PREFIX = 'fa:'
const DEFAULT_BG = '#1e5bff'

export interface ParsedAvatar {
  type: 'fa' | 'image' | 'none'
  icon: string
  bg: string
  url: string
}

// 由图标名生成存储值
export const toAvatarValue = (icon: string): string => `${FA_PREFIX}${icon}`

// 解析头像存储值
export const parseAvatar = (avatarUrl?: string | null): ParsedAvatar => {
  if (!avatarUrl) return { type: 'none', icon: '', bg: DEFAULT_BG, url: '' }
  if (avatarUrl.startsWith(FA_PREFIX)) {
    const icon = avatarUrl.slice(FA_PREFIX.length)
    const preset = PRESET_AVATARS.find((a) => a.icon === icon)
    return { type: 'fa', icon, bg: preset?.bg || DEFAULT_BG, url: '' }
  }
  return { type: 'image', icon: '', bg: DEFAULT_BG, url: avatarUrl }
}
