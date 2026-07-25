import React, { useRef, useEffect, forwardRef, useImperativeHandle } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'
import { useKeyboard } from '../hooks/useKeyboard'
import { usePointerLock } from '../hooks/usePointerLock'
import {
  PLANET_RADIUS,
  PLAYER_HEIGHT,
  WALK_SPEED,
  GRAVITY,
  JUMP_FORCE,
  CAM_DISTANCE,
  CAM_HEIGHT,
  CAM_LAG,
  FOOTSTEP_INTERVAL,
  HOMING_LERP,
  HOMING_ARRIVE_DIST,
} from '../utils/constants'

// Reusable vectors (allocated once, never re-created per frame)
const _up = new THREE.Vector3()
const _forward = new THREE.Vector3()
const _right = new THREE.Vector3()
const _move = new THREE.Vector3()
const _desiredPos = new THREE.Vector3()
const _camTarget = new THREE.Vector3()
const _lookAt = new THREE.Vector3()
const _camRight = new THREE.Vector3()
const _quat = new THREE.Quaternion()
const _q2 = new THREE.Quaternion()
const _yAxis = new THREE.Vector3(0, 1, 0)
const _homePos = new THREE.Vector3(0, PLANET_RADIUS + PLAYER_HEIGHT, 0)

// posRef: an external THREE.Vector3 ref (owned by App) that we write the
// player's world position into every frame. Companion.jsx and Particles.jsx
// read from it without forcing React re-renders.
const Player = forwardRef(function Player({ active, paused = false, onFootstep, posRef }, ref) {
  const playerRef = useRef()
  const bodyRef = useRef()
  const headRef = useRef()
  const velRef = useRef(new THREE.Vector3())
  const onGroundRef = useRef(true)
  const footstepTimerRef = useRef(0)
  const bobRef = useRef({ leftArm: null, rightArm: null, leftLeg: null, rightLeg: null })
  const walkPhaseRef = useRef(0)
  const homingRef = useRef(false)

  const keys = useKeyboard()
  const { euler } = usePointerLock(active, paused || homingRef.current)
  const { camera } = useThree()

  // Place player at north pole of planet on mount
  useEffect(() => {
    if (playerRef.current) {
      playerRef.current.position.copy(_homePos)
      if (posRef) posRef.current.copy(_homePos)
    }
    camera.position.set(0, PLANET_RADIUS + PLAYER_HEIGHT + CAM_HEIGHT, CAM_DISTANCE)
    camera.lookAt(0, PLANET_RADIUS + PLAYER_HEIGHT, 0)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [camera])

  // Exposed to parent (App) via ref so a "Home" button can gently walk the
  // player back to the starting point without teleporting jarringly.
  useImperativeHandle(ref, () => ({
    goHome: () => {
      homingRef.current = true
    },
  }))

  useFrame((_, delta) => {
    if (!active || !playerRef.current) return

    const dt = Math.min(delta, 0.05)
    const pos = playerRef.current.position

    if (homingRef.current) {
      // Ease the player back toward the starting point along the sphere,
      // ignoring input and gravity until arrival.
      velRef.current.set(0, 0, 0)
      pos.lerp(_homePos, HOMING_LERP)
      pos.normalize().multiplyScalar(PLANET_RADIUS + PLAYER_HEIGHT)
      euler.current.yaw += (0 - euler.current.yaw) * HOMING_LERP
      euler.current.pitch += (0 - euler.current.pitch) * HOMING_LERP
      if (pos.distanceTo(_homePos) < HOMING_ARRIVE_DIST) {
        pos.copy(_homePos)
        homingRef.current = false
      }
    } else if (!paused) {
      // ─── 1. Surface normal ("up" on this planet) ───────────────────────
      _up.copy(pos).normalize()

      // ─── 2. Build look direction from yaw/pitch ─────────────────────────
      const refAxis = Math.abs(_up.y) < 0.99
        ? new THREE.Vector3(0, 1, 0)
        : new THREE.Vector3(1, 0, 0)
      _right.crossVectors(_up, refAxis).normalize()
      _forward.crossVectors(_right, _up).normalize()

      _quat.setFromAxisAngle(_up, euler.current.yaw)
      _forward.applyQuaternion(_quat)
      _right.crossVectors(_up, _forward).normalize()

      // ─── 3. Movement input ───────────────────────────────────────────────
      _move.set(0, 0, 0)
      if (keys.current.forward)  _move.addScaledVector(_forward, 1)
      if (keys.current.backward) _move.addScaledVector(_forward, -1)
      if (keys.current.right)    _move.addScaledVector(_right, -1)
      if (keys.current.left)     _move.addScaledVector(_right, 1)

      const len = _move.length()
      const isMoving = len > 0
      if (isMoving) _move.divideScalar(len)

      // ─── 4. Apply movement to velocity ──────────────────────────────────
      const vel = velRef.current
      _move.multiplyScalar(WALK_SPEED)
      const radialVel = vel.dot(_up)
      vel.addScaledVector(_up, -radialVel)
      vel.lerp(_move, 0.2)
      vel.addScaledVector(_up, radialVel)

      // ─── 5. Gravity ──────────────────────────────────────────────────────
      vel.addScaledVector(_up, -GRAVITY * dt)

      // ─── 6. Jump ─────────────────────────────────────────────────────────
      if (keys.current.jump && onGroundRef.current) {
        vel.addScaledVector(_up, JUMP_FORCE)
        onGroundRef.current = false
        keys.current.jump = false
      }

      // ─── 7. Integrate position ───────────────────────────────────────────
      pos.addScaledVector(vel, dt)

      // ─── 8. Ground constraint ────────────────────────────────────────────
      const distFromCenter = pos.length()
      const groundDist = PLANET_RADIUS + PLAYER_HEIGHT

      if (distFromCenter <= groundDist) {
        pos.normalize().multiplyScalar(groundDist)
        const radVel = vel.dot(_up.copy(pos).normalize())
        if (radVel < 0) vel.addScaledVector(_up, -radVel)
        onGroundRef.current = true
      } else {
        onGroundRef.current = false
      }

      // ─── 8b. Footsteps ──────────────────────────────────────────────────
      if (isMoving && onGroundRef.current) {
        footstepTimerRef.current += dt
        if (footstepTimerRef.current >= FOOTSTEP_INTERVAL) {
          footstepTimerRef.current = 0
          onFootstep && onFootstep()
        }
        walkPhaseRef.current += dt * 8
      } else {
        footstepTimerRef.current = FOOTSTEP_INTERVAL
        walkPhaseRef.current = 0
      }

      // ─── 9. Walk-cycle limb swing ─────────────────────────────────────────
      const swing = isMoving ? Math.sin(walkPhaseRef.current) * 0.35 : 0
      if (bobRef.current.leftLeg) bobRef.current.leftLeg.rotation.x = swing
      if (bobRef.current.rightLeg) bobRef.current.rightLeg.rotation.x = -swing
      if (bobRef.current.leftArm) bobRef.current.leftArm.rotation.x = -swing * 0.7
      if (bobRef.current.rightArm) bobRef.current.rightArm.rotation.x = swing * 0.7
    }

    // ─── Orient player mesh to planet surface (runs every frame) ───────────
    if (bodyRef.current) {
      _up.copy(pos).normalize()
      _quat.setFromUnitVectors(_yAxis, _up)
      _q2.setFromAxisAngle(_yAxis, euler.current.yaw)
      playerRef.current.quaternion.multiplyQuaternions(_quat, _q2)
    }

    // Publish world position for Companion / reactive particles
    if (posRef) posRef.current.copy(pos)

    // ─── Smooth third-person camera (always runs, incl. during homing) ────
    _up.copy(pos).normalize()

    const camRef = Math.abs(_up.y) < 0.99
      ? new THREE.Vector3(0, 1, 0)
      : new THREE.Vector3(1, 0, 0)
    _right.crossVectors(_up, camRef).normalize()
    _forward.crossVectors(_right, _up).normalize()
    _quat.setFromAxisAngle(_up, euler.current.yaw)
    _forward.applyQuaternion(_quat)

    _desiredPos.copy(pos)
      .addScaledVector(_forward, -CAM_DISTANCE)
      .addScaledVector(_up, CAM_HEIGHT)

    camera.position.lerp(_desiredPos, CAM_LAG)

    _lookAt.copy(pos).addScaledVector(_up, 0.6)

    _camRight.crossVectors(_up, _forward).normalize().negate()
    _camTarget.copy(_lookAt)
      .addScaledVector(_up, Math.sin(euler.current.pitch) * 3)
      .addScaledVector(_forward, -Math.cos(euler.current.pitch) * 0.5)

    camera.lookAt(_camTarget)
  })

  return (
    <group ref={playerRef}>
      <group ref={bodyRef}>
        <mesh castShadow position={[0, 0.15, 0]}>
          <capsuleGeometry args={[0.22, 0.55, 6, 12]} />
          <meshStandardMaterial color="#f5d0e8" roughness={0.6} />
        </mesh>

        <mesh ref={headRef} castShadow position={[0, 0.82, 0]}>
          <sphereGeometry args={[0.22, 14, 14]} />
          <meshStandardMaterial color="#fde8d5" roughness={0.5} />
        </mesh>

        <mesh position={[0.08, 0.87, 0.18]}>
          <sphereGeometry args={[0.04, 6, 6]} />
          <meshStandardMaterial color="#3d2060" />
        </mesh>
        <mesh position={[-0.08, 0.87, 0.18]}>
          <sphereGeometry args={[0.04, 6, 6]} />
          <meshStandardMaterial color="#3d2060" />
        </mesh>

        <group position={[0.33, 0.32, 0]} ref={(el) => (bobRef.current.leftArm = el)}>
          <mesh castShadow position={[0, -0.22, 0]} rotation={[0, 0, 0.3]}>
            <capsuleGeometry args={[0.08, 0.4, 5, 10]} />
            <meshStandardMaterial color="#f5d0e8" roughness={0.6} />
          </mesh>
        </group>

        <group position={[-0.33, 0.32, 0]} ref={(el) => (bobRef.current.rightArm = el)}>
          <mesh castShadow position={[0, -0.22, 0]} rotation={[0, 0, -0.3]}>
            <capsuleGeometry args={[0.08, 0.4, 5, 10]} />
            <meshStandardMaterial color="#f5d0e8" roughness={0.6} />
          </mesh>
        </group>

        <group position={[0.14, -0.25, 0]} ref={(el) => (bobRef.current.leftLeg = el)}>
          <mesh castShadow position={[0, -0.2, 0]}>
            <capsuleGeometry args={[0.09, 0.38, 5, 10]} />
            <meshStandardMaterial color="#c9a8e0" roughness={0.7} />
          </mesh>
        </group>

        <group position={[-0.14, -0.25, 0]} ref={(el) => (bobRef.current.rightLeg = el)}>
          <mesh castShadow position={[0, -0.2, 0]}>
            <capsuleGeometry args={[0.09, 0.38, 5, 10]} />
            <meshStandardMaterial color="#c9a8e0" roughness={0.7} />
          </mesh>
        </group>
      </group>
    </group>
  )
})

export default Player
