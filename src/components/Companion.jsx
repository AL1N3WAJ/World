import React, { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { PLANET_RADIUS, PLAYER_HEIGHT, COLORS } from '../utils/constants'

// A small, soft-blue low-poly companion that quietly walks alongside the
// player — a gentle stand-in for "the two of us" exploring the planet
// together, rather than the player being alone in the world.

const _up = new THREE.Vector3()
const _refAxis = new THREE.Vector3()
const _right = new THREE.Vector3()
const _target = new THREE.Vector3()
const _quat = new THREE.Quaternion()
const _yAxis = new THREE.Vector3(0, 1, 0)
const START = new THREE.Vector3(0.85, 0, 0.4)
  .add(new THREE.Vector3(0, PLANET_RADIUS + PLAYER_HEIGHT, 0))

export default function Companion({ active, playerPosRef }) {
  const groupRef = useRef()
  const bodyRef = useRef()
  const posRef = useRef(START.clone())
  const bobPhase = useRef(Math.random() * Math.PI * 2)

  useFrame(({ clock }, delta) => {
    if (!active || !playerPosRef?.current || !groupRef.current) return
    const playerPos = playerPosRef.current
    const dist = playerPos.length()

    _up.copy(playerPos).normalize()
    _refAxis.set(0, 1, 0)
    if (Math.abs(_up.y) > 0.99) _refAxis.set(1, 0, 0)
    _right.crossVectors(_up, _refAxis).normalize()

    // Trail slightly behind-and-beside the player, always on the surface
    _target.copy(playerPos).addScaledVector(_right, 0.85)
    _target.normalize().multiplyScalar(dist)

    posRef.current.lerp(_target, Math.min(1, delta * 2.2))
    posRef.current.normalize().multiplyScalar(dist)

    groupRef.current.position.copy(posRef.current)

    const up2 = posRef.current.clone().normalize()
    _quat.setFromUnitVectors(_yAxis, up2)
    groupRef.current.quaternion.copy(_quat)

    if (bodyRef.current) {
      const t = clock.getElapsedTime()
      bodyRef.current.position.y = 0.02 + Math.sin(t * 2.4 + bobPhase.current) * 0.02
    }
  })

  return (
    <group ref={groupRef}>
      <group ref={bodyRef}>
        {/* Torso */}
        <mesh castShadow position={[0, 0.13, 0]}>
          <capsuleGeometry args={[0.17, 0.42, 6, 12]} />
          <meshStandardMaterial color={COLORS.companion} roughness={0.6} />
        </mesh>
        {/* Head */}
        <mesh castShadow position={[0, 0.62, 0]}>
          <sphereGeometry args={[0.17, 14, 14]} />
          <meshStandardMaterial color={COLORS.companionSoft} roughness={0.5} />
        </mesh>
        {/* Eyes */}
        <mesh position={[0.06, 0.66, 0.14]}>
          <sphereGeometry args={[0.03, 6, 6]} />
          <meshStandardMaterial color="#3d3a60" />
        </mesh>
        <mesh position={[-0.06, 0.66, 0.14]}>
          <sphereGeometry args={[0.03, 6, 6]} />
          <meshStandardMaterial color="#3d3a60" />
        </mesh>
        {/* Little arms */}
        <mesh castShadow position={[0.24, 0.22, 0]} rotation={[0, 0, 0.35]}>
          <capsuleGeometry args={[0.06, 0.3, 5, 8]} />
          <meshStandardMaterial color={COLORS.companion} roughness={0.6} />
        </mesh>
        <mesh castShadow position={[-0.24, 0.22, 0]} rotation={[0, 0, -0.35]}>
          <capsuleGeometry args={[0.06, 0.3, 5, 8]} />
          <meshStandardMaterial color={COLORS.companion} roughness={0.6} />
        </mesh>
        {/* Little legs */}
        <mesh castShadow position={[0.09, -0.18, 0]}>
          <capsuleGeometry args={[0.07, 0.28, 5, 8]} />
          <meshStandardMaterial color="#8fb8e8" roughness={0.7} />
        </mesh>
        <mesh castShadow position={[-0.09, -0.18, 0]}>
          <capsuleGeometry args={[0.07, 0.28, 5, 8]} />
          <meshStandardMaterial color="#8fb8e8" roughness={0.7} />
        </mesh>
      </group>
      {/* Soft glow so the companion reads as "special", not just decor */}
      <pointLight color="#bcdcff" intensity={0.35} distance={1.4} position={[0, 0.4, 0]} />
    </group>
  )
}
