import React, { useRef, useMemo, useState } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { PLANET_RADIUS, ZONES } from '../utils/constants'
import { LOVE_NOTES } from '../utils/loveNotes'

function alignToNormal(normal) {
  const q = new THREE.Quaternion()
  q.setFromUnitVectors(new THREE.Vector3(0, 1, 0), normal.clone().normalize())
  return q
}

function placeNotesForZone(zoneKey) {
  const zone = ZONES[zoneKey]
  const notes = LOVE_NOTES[zoneKey]
  const q = alignToNormal(zone.center)
  let seed = zoneKey.charCodeAt(0) * 31 + 91
  const rand = () => {
    seed = (seed * 1103515245 + 12345) & 0x7fffffff
    return seed / 0x7fffffff
  }

  return notes.map((note, i) => {
    const angle = (i / notes.length) * Math.PI * 2 + rand() * 0.6
    const r = zone.angularRadius * (0.28 + rand() * 0.3)
    const local = new THREE.Vector3(
      Math.sin(r) * Math.cos(angle),
      Math.cos(r),
      Math.sin(r) * Math.sin(angle)
    )
    local.applyQuaternion(q).normalize()
    const position = local.clone().multiplyScalar(PLANET_RADIUS + 0.04)
    return { ...note, normal: local, position }
  })
}

function GlowHeart({ hovered }) {
  const shape = useMemo(() => {
    const s = new THREE.Shape()
    s.moveTo(0, 0.06)
    s.bezierCurveTo(0, 0.12, -0.09, 0.16, -0.16, 0.1)
    s.bezierCurveTo(-0.24, 0.03, -0.16, -0.08, 0, -0.2)
    s.bezierCurveTo(0.16, -0.08, 0.24, 0.03, 0.16, 0.1)
    s.bezierCurveTo(0.09, 0.16, 0, 0.12, 0, 0.06)
    return s
  }, [])
  const geo = useMemo(
    () => new THREE.ExtrudeGeometry(shape, { depth: 0.05, bevelEnabled: true, bevelSize: 0.015, bevelThickness: 0.015 }),
    [shape]
  )
  return (
    <mesh geometry={geo} rotation={[0, 0, Math.PI]} scale={hovered ? 1.18 : 1}>
      <meshStandardMaterial
        color="#ff9fc0"
        emissive="#ff5f9e"
        emissiveIntensity={hovered ? 1.4 : 0.7}
        roughness={0.35}
      />
    </mesh>
  )
}

function GlowEnvelope({ hovered }) {
  return (
    <group scale={hovered ? 1.15 : 1}>
      <mesh castShadow>
        <boxGeometry args={[0.26, 0.02, 0.18]} />
        <meshStandardMaterial color="#fff6e8" emissive="#ffd9a0" emissiveIntensity={hovered ? 0.9 : 0.4} roughness={0.5} />
      </mesh>
      <mesh position={[0, 0.015, 0]} rotation={[0, 0, 0]}>
        <coneGeometry args={[0.13, 0.09, 4]} />
        <meshStandardMaterial color="#ffe8c8" emissive="#ffbf70" emissiveIntensity={hovered ? 0.9 : 0.4} roughness={0.5} />
      </mesh>
    </group>
  )
}

function GlowStone({ hovered, color = '#c8a8ff', glow = '#a070ff' }) {
  return (
    <mesh castShadow scale={hovered ? 1.2 : 1}>
      <icosahedronGeometry args={[0.13, 0]} />
      <meshStandardMaterial
        color={color}
        emissive={glow}
        emissiveIntensity={hovered ? 1.3 : 0.6}
        roughness={0.25}
        metalness={0.2}
      />
    </mesh>
  )
}

function GlowLantern({ hovered }) {
  const ref = useRef()
  useFrame(({ clock }) => {
    if (ref.current) {
      ref.current.position.y = 0.55 + Math.sin(clock.getElapsedTime() * 0.9) * 0.04
    }
  })
  return (
    <group ref={ref} position={[0, 0.55, 0]} scale={hovered ? 1.15 : 1}>
      <mesh>
        <cylinderGeometry args={[0.01, 0.01, 0.18, 4]} />
        <meshStandardMaterial color="#c8a860" />
      </mesh>
      <mesh position={[0, -0.13, 0]}>
        <sphereGeometry args={[0.13, 10, 10]} />
        <meshStandardMaterial
          color="#fff0c0"
          emissive="#ffb860"
          emissiveIntensity={hovered ? 1.5 : 0.9}
          transparent
          opacity={0.85}
        />
      </mesh>
    </group>
  )
}

function GlowStar({ hovered }) {
  const shape = useMemo(() => {
    const s = new THREE.Shape()
    const spikes = 5
    const outer = 0.16
    const inner = 0.065
    for (let i = 0; i < spikes * 2; i++) {
      const r = i % 2 === 0 ? outer : inner
      const a = (i / (spikes * 2)) * Math.PI * 2 - Math.PI / 2
      const x = Math.cos(a) * r
      const y = Math.sin(a) * r
      if (i === 0) s.moveTo(x, y)
      else s.lineTo(x, y)
    }
    s.closePath()
    return s
  }, [])
  const geo = useMemo(
    () => new THREE.ExtrudeGeometry(shape, { depth: 0.04, bevelEnabled: true, bevelSize: 0.01, bevelThickness: 0.01 }),
    [shape]
  )
  return (
    <mesh geometry={geo} scale={hovered ? 1.2 : 1}>
      <meshStandardMaterial
        color="#e8e0ff"
        emissive="#b8a0ff"
        emissiveIntensity={hovered ? 1.5 : 0.8}
        roughness={0.2}
        metalness={0.3}
      />
    </mesh>
  )
}

function GlowFlowerHeart({ hovered }) {
  return (
    <group scale={hovered ? 1.15 : 1}>
      <GlowHeart hovered={false} />
      {[0, 1, 2, 3].map((i) => (
        <mesh key={i} position={[Math.cos(i * 1.6) * 0.14, Math.sin(i * 1.6) * 0.1, 0.03]}>
          <sphereGeometry args={[0.035, 6, 6]} />
          <meshStandardMaterial color="#fff0f8" emissive="#ffc0e0" emissiveIntensity={hovered ? 1 : 0.5} />
        </mesh>
      ))}
    </group>
  )
}

function VisualForType({ type, hovered }) {
  switch (type) {
    case 'heart':
      return <GlowHeart hovered={hovered} />
    case 'envelope':
      return <GlowEnvelope hovered={hovered} />
    case 'lantern':
      return <GlowLantern hovered={hovered} />
    case 'star':
      return <GlowStar hovered={hovered} />
    case 'flowerheart':
      return <GlowFlowerHeart hovered={hovered} />
    case 'shell':
      return <GlowStone hovered={hovered} color="#ffd8c0" glow="#ff9860" />
    case 'bottle':
      return <GlowStone hovered={hovered} color="#a8e0e8" glow="#50c0d0" />
    case 'starfish':
      return <GlowStone hovered={hovered} color="#ffe0a0" glow="#ffb050" />
    case 'firefly':
      return <GlowLantern hovered={hovered} />
    default:
      return <GlowStone hovered={hovered} />
  }
}

function NoteObject({ note, onOpen, isOpen }) {
  const [hovered, setHovered] = useState(false)
  const groupRef = useRef()
  const q = useMemo(() => alignToNormal(note.normal), [note.normal])

  useFrame(({ clock }) => {
    if (groupRef.current) {
      const t = clock.getElapsedTime()
      groupRef.current.position.y = 0.22 + Math.sin(t * 1.1 + note.position.x) * 0.035
      groupRef.current.rotation.y = t * 0.6
    }
  })

  return (
    <group position={note.position} quaternion={q}>
      <mesh position={[0, 0.22, 0]}>
        <sphereGeometry args={[hovered ? 0.34 : 0.26, 12, 12]} />
        <meshBasicMaterial color="#ffd0ea" transparent opacity={hovered ? 0.16 : 0.08} depthWrite={false} />
      </mesh>

      <group
        ref={groupRef}
        onPointerOver={(e) => {
          e.stopPropagation()
          setHovered(true)
          document.body.style.cursor = 'pointer'
        }}
        onPointerOut={(e) => {
          e.stopPropagation()
          setHovered(false)
          document.body.style.cursor = 'auto'
        }}
        onClick={(e) => {
          e.stopPropagation()
          onOpen(note)
        }}
      >
        <VisualForType type={note.type} hovered={hovered || isOpen} />
      </group>

      <pointLight
        position={[0, 0.25, 0]}
        color="#ffcae0"
        intensity={hovered ? 0.9 : 0.4}
        distance={1.8}
      />
    </group>
  )
}

export default function InteractiveObjects({ onOpenNote, openNoteId }) {
  const placedByZone = useMemo(() => {
    const result = {}
    for (const zoneKey of Object.keys(LOVE_NOTES)) {
      result[zoneKey] = placeNotesForZone(zoneKey)
    }
    return result
  }, [])

  return (
    <group>
      {Object.values(placedByZone).flatMap((notes) =>
        notes.map((note) => (
          <NoteObject
            key={note.id}
            note={note}
            onOpen={onOpenNote}
            isOpen={openNoteId === note.id}
          />
        ))
      )}
    </group>
  )
}
