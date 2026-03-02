const C = {
  // Display
  TILE: 32,
  WIDTH: 800,
  HEIGHT: 500,

  // Physics
  GRAVITY: 0.45,
  JUMP_FORCE: -7,
  FLY_FORCE: -0.6,
  MAX_FALL_SPEED: 10,
  MOVE_SPEED: 3.2,
  WALL_SLIDE_SPEED: 1.2,

  // Stamina
  MAX_STAMINA: 100,
  STAMINA_DRAIN: 0.35,      // per frame while flying
  STAMINA_REGEN: 0.8,       // per frame while hanging
  STAMINA_LOW: 25,          // threshold for warning color

  // Echolocation
  ECHO_COOLDOWN: 180,       // frames (~3s at 60fps)
  ECHO_DURATION: 240,       // frames visible
  ECHO_FADE_START: 160,     // when to start fading
  ECHO_RADIUS_GROWTH: 6,    // px per frame during pulse expand

  // Vision
  VISION_RADIUS: 120,       // px around player always visible
  VISION_SOFTNESS: 60,      // px of gradient edge

  // Player
  MAX_HP: 3,
  INVINCIBLE_FRAMES: 90,
  COYOTE_FRAMES: 8,

  // Colors (cave theme)
  BG: '#0a0812',
  CAVE_DARK: '#0d0b14',
  PLATFORM_COLOR: '#2a2040',
  PLATFORM_EDGE: '#5a4a7a',
  PLATFORM_ECHO: '#c084fc',
  SPIKE_COLOR: '#cc3333',
  SPIKE_ECHO: '#ff6666',
  FRUIT_COLORS: ['#ff6b6b', '#ffd93d', '#6bcb77', '#4d96ff', '#ff922b'],
  HUD_BG: 'rgba(10,8,18,0.85)',
  STAMINA_FULL: '#7c3aed',
  STAMINA_LOW_C: '#ef4444',
  ECHO_PULSE_COLOR: 'rgba(192,132,252,',
  TEXT_MAIN: '#e2d9f3',
  TEXT_DIM: '#7c6e99',
  HANG_GLOW: '#a78bfa',
};
