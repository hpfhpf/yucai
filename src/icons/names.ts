export const ICON_NAMES = [
  "common/accept",
  "common/cameraSwitch",
  "common/closeMic",
  "common/directive",
  "common/function",
  "common/hangUp",
  "common/mic",
  "common/modules",
  "common/option",
  "common/plus",
  "common/search",
  "common/tips",
  "security/lock",
  "security/verification",
  "user/doctor",
  "user/user",
] as const;

export type IconName = (typeof ICON_NAMES)[number];
