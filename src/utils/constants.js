import * as THREE from 'three'

// Planet
export const PLANET_RADIUS = 8

// Player physics
export const PLAYER_HEIGHT = 0.9
export const WALK_SPEED = 3.5
export const GRAVITY = 12
export const JUMP_FORCE = 5

// Camera
export const CAM_DISTANCE = 4
export const CAM_HEIGHT = 1.6
export const CAM_LAG = 0.08

// Footstep timing — distance-based, tuned to WALK_SPEED
export const FOOTSTEP_INTERVAL = 0.36 // seconds between steps at walk speed

// Homecoming (the "Home" button) — how quickly the player eases back
export const HOMING_LERP = 0.06
export const HOMING_ARRIVE_DIST = 0.05

// The person this little world is for — kept in one place so it's easy
// to find/update, and reused by the final letter + the planet signature.
export const PARTNER_NAME = 'Fariba Nehreen Binti'

// Pastel + golden-hour palette
export const COLORS = {
  planetBase:   '#c8b4e8',
  planetPole:   '#f7cfe2',
  planetEquator:'#b5d8f7',
  grass:        '#aee4b8',
  treeTrunk:    '#d4a98a',
  treeLeaf:     '#b8e4c2',
  skyNear:      '#3a1f4d',
  skyFar:       '#160a24',
  sunLight:     '#ffcf8a',
  sunLightWarm: '#ffb06a',
  ambientLight: '#8a5fae',
  fog:          '#241432',
  goldenRim:    '#ffdca0',
  companion:    '#a8d0f0',
  companionSoft:'#dceaff',
}

// ── Zone definitions ──────────────────────────────────────────────────────────
export const ZONES = {
  BEACH: {
    name: 'First Date Beach',
    emoji: '🌊',
    center: new THREE.Vector3(1, -0.3, 0.5).normalize(),
    angularRadius: 0.72,
    groundColor: '#f5e6c8',
    accentColor: '#a8d8ea',
  },
  FOREST: {
    name: 'Memory Forest',
    emoji: '🌿',
    center: new THREE.Vector3(-0.8, 0.3, -0.5).normalize(),
    angularRadius: 0.70,
    groundColor: '#7dbf8e',
    accentColor: '#4a8c5c',
  },
  HOME: {
    name: 'Home Hill',
    emoji: '🏡',
    center: new THREE.Vector3(0.2, 0.95, 0.2).normalize(),
    angularRadius: 0.52,
    groundColor: '#d4e8a8',
    accentColor: '#b8d46e',
  },
  CITY: {
    name: 'Future City',
    emoji: '✨',
    center: new THREE.Vector3(-0.3, -0.85, 0.4).normalize(),
    angularRadius: 0.65,
    groundColor: '#b8c8e8',
    accentColor: '#d4b8f0',
  },
}

// Given a normalized surface normal, return the zone key or null
export function getZone(normal) {
  for (const [key, zone] of Object.entries(ZONES)) {
    const dot = normal.dot(zone.center)
    const angle = Math.acos(Math.max(-1, Math.min(1, dot)))
    if (angle < zone.angularRadius) return key
  }
  return null
}
