import React, { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { PLANET_RADIUS } from '../utils/constants'

// Soft ambient particles (hearts + petals + stardust) drifting gently around
// the planet's surface. They also gently scatter away from the player as
// they walk near, so the world feels responsive rather than purely decorative.

const PARTICLE_COUNT = 90
const REACT_RADIUS = 2.2
const REACT_STRENGTH = 0.6

function makeHeartTexture() {
  const canvas = document.createElement('canvas')
  canvas.width = 64
  canvas.height = 64
  const ctx = canvas.getContext('2d')
  ctx.translate(32, 32)
  ctx.scale(1.6, 1.6)
  ctx.beginPath()
  ctx.moveTo(0, 6)
  ctx.bezierCurveTo(0, 0, -14, -4, -16, 8)
  ctx.bezierCurveTo(-18, 20, -6, 24, 0, 32)
  ctx.bezierCurveTo(6, 24, 18, 20, 16, 8)
  ctx.bezierCurveTo(14, -4, 0, 0, 0, 6)
  ctx.closePath()
  ctx.fillStyle = 'rgba(255, 190, 220, 1)'
  ctx.fill()
  return new THREE.CanvasTexture(canvas)
}

function makePetalTexture() {
  const canvas = document.createElement('canvas')
  canvas.width = 64
  canvas.height = 64
  const ctx = canvas.getContext('2d')
  ctx.translate(32, 32)
  ctx.rotate(Math.PI / 4)
  ctx.beginPath()
  ctx.ellipse(0, 0, 10, 20, 0, 0, Math.PI * 2)
  ctx.fillStyle = 'rgba(255, 210, 230, 1)'
  ctx.fill()
  return new THREE.CanvasTexture(canvas)
}

function makeStarTexture() {
  const canvas = document.createElement('canvas')
  canvas.width = 64
  canvas.height = 64
  const ctx = canvas.getContext('2d')
  const grad = ctx.createRadialGradient(32, 32, 0, 32, 32, 32)
  grad.addColorStop(0, 'rgba(255,255,255,1)')
  grad.addColorStop(1, 'rgba(255,255,255,0)')
  ctx.fillStyle = grad
  ctx.fillRect(0, 0, 64, 64)
  return new THREE.CanvasTexture(canvas)
}

function ParticleLayer({ texture, count, minR, maxR, size, speed, opacity, playerPosRef }) {
  const pointsRef = useRef()

  const { positions, phases } = useMemo(() => {
    const positions = new Float32Array(count * 3)
    const phases = new Float32Array(count)

    for (let i = 0; i < count; i++) {
      const theta = Math.random() * Math.PI * 2
      const phi = Math.acos(2 * Math.random() - 1)
      const r = minR + Math.random() * (maxR - minR)
      positions[i * 3] = r * Math.sin(phi) * Math.cos(theta)
      positions[i * 3 + 1] = r * Math.cos(phi)
      positions[i * 3 + 2] = r * Math.sin(phi) * Math.sin(theta)
      phases[i] = Math.random() * Math.PI * 2
    }
    return { positions, phases }
  }, [count, minR, maxR])

  const basePositions = useRef(positions.slice())

  useFrame(({ clock }) => {
    if (!pointsRef.current) return
    const t = clock.getElapsedTime()
    const posAttr = pointsRef.current.geometry.attributes.position
    const arr = posAttr.array
    const base = basePositions.current
    const player = playerPosRef?.current

    for (let i = 0; i < count; i++) {
      const idx = i * 3
      const angle = t * speed * 0.05 + phases[i]
      const bx = base[idx], by = base[idx + 1], bz = base[idx + 2]
      const cosA = Math.cos(angle * 0.15)
      const sinA = Math.sin(angle * 0.15)
      const x = bx * cosA - bz * sinA
      const z = bx * sinA + bz * cosA
      const bob = Math.sin(t * 0.5 + phases[i]) * 0.15
      const y = by + bob

      if (player) {
        const dx = x - player.x
        const dy = y - player.y
        const dz = z - player.z
        const distSq = dx * dx + dy * dy + dz * dz
        if (distSq < REACT_RADIUS * REACT_RADIUS) {
          const dist = Math.sqrt(distSq) || 0.001
          const push = (1 - dist / REACT_RADIUS) * REACT_STRENGTH
          arr[idx] = x + (dx / dist) * push
          arr[idx + 1] = y + (dy / dist) * push
          arr[idx + 2] = z + (dz / dist) * push
          continue
        }
      }

      arr[idx] = x
      arr[idx + 1] = y
      arr[idx + 2] = z
    }
    posAttr.needsUpdate = true
    pointsRef.current.rotation.y = t * 0.01
  })

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" array={positions} count={count} itemSize={3} />
      </bufferGeometry>
      <pointsMaterial
        map={texture}
        size={size}
        transparent
        opacity={opacity}
        depthWrite={false}
        sizeAttenuation
        blending={THREE.AdditiveBlending}
      />
    </points>
  )
}

export default function Particles({ playerPosRef }) {
  const heartTex = useMemo(() => makeHeartTexture(), [])
  const petalTex = useMemo(() => makePetalTexture(), [])
  const starTex = useMemo(() => makeStarTexture(), [])

  return (
    <group>
      <ParticleLayer
        texture={heartTex}
        count={26}
        minR={PLANET_RADIUS + 0.6}
        maxR={PLANET_RADIUS + 2.4}
        size={0.35}
        speed={1.2}
        opacity={0.55}
        playerPosRef={playerPosRef}
      />
      <ParticleLayer
        texture={petalTex}
        count={34}
        minR={PLANET_RADIUS + 0.4}
        maxR={PLANET_RADIUS + 1.8}
        size={0.22}
        speed={1.8}
        opacity={0.5}
        playerPosRef={playerPosRef}
      />
      <ParticleLayer
        texture={starTex}
        count={PARTICLE_COUNT - 26 - 34}
        minR={PLANET_RADIUS + 1.5}
        maxR={PLANET_RADIUS + 4.5}
        size={0.16}
        speed={0.6}
        opacity={0.7}
        playerPosRef={playerPosRef}
      />
    </group>
  )
}
