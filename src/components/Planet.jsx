import React, { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { PLANET_RADIUS, COLORS, ZONES, PARTNER_NAME } from '../utils/constants'

// ─── Shared quaternion helper ────────────────────────────────────────────────
function alignToNormal(normal) {
  const q = new THREE.Quaternion()
  q.setFromUnitVectors(new THREE.Vector3(0, 1, 0), normal.clone().normalize())
  return q
}

// ─── BEACH decorations ───────────────────────────────────────────────────────
function BeachUmbrella({ normal, position, color = '#f9a8d4', scale = 1 }) {
  const q = useMemo(() => alignToNormal(normal), [normal])
  return (
    <group position={position} quaternion={q} scale={scale}>
      <mesh castShadow position={[0, 0.5, 0]}>
        <cylinderGeometry args={[0.035, 0.035, 1.0, 6]} />
        <meshStandardMaterial color="#e8d0a0" roughness={0.9} />
      </mesh>
      <mesh castShadow position={[0, 1.05, 0]}>
        <coneGeometry args={[0.55, 0.35, 12]} />
        <meshStandardMaterial color={color} roughness={0.7} side={THREE.DoubleSide} />
      </mesh>
      <mesh position={[0, 0.88, 0]}>
        <torusGeometry args={[0.54, 0.03, 6, 16]} />
        <meshStandardMaterial color="#ffffff" roughness={0.5} />
      </mesh>
    </group>
  )
}

function Seashell({ normal, position, scale = 1 }) {
  const q = useMemo(() => alignToNormal(normal), [normal])
  return (
    <group position={position} quaternion={q} scale={scale}>
      <mesh castShadow rotation={[0.4, 0, 0.3]}>
        <torusGeometry args={[0.12, 0.07, 6, 10, Math.PI * 1.4]} />
        <meshStandardMaterial color="#f9c9b0" roughness={0.6} metalness={0.1} />
      </mesh>
    </group>
  )
}

function WaveArc({ normal, position, scale = 1 }) {
  const q = useMemo(() => alignToNormal(normal), [normal])
  return (
    <group position={position} quaternion={q} scale={scale}>
      <mesh>
        <torusGeometry args={[0.4, 0.04, 4, 16, Math.PI]} />
        <meshStandardMaterial color="#a8d8ea" transparent opacity={0.6} roughness={0.3} />
      </mesh>
    </group>
  )
}

// ─── FOREST decorations ──────────────────────────────────────────────────────
function ForestTree({ normal, position, scale = 1, variant = 0 }) {
  const q = useMemo(() => alignToNormal(normal), [normal])
  const trunkColor = '#8a6040'
  const leaf1 = variant === 0 ? '#5a8c6a' : variant === 1 ? '#7abf8a' : '#4a7a5a'
  const leaf2 = variant === 0 ? '#6aaa7a' : variant === 1 ? '#8ace9a' : '#5a906a'
  return (
    <group position={position} quaternion={q} scale={scale}>
      <mesh castShadow position={[0, 0.5, 0]}>
        <cylinderGeometry args={[0.08, 0.13, 1.0, 7]} />
        <meshStandardMaterial color={trunkColor} roughness={0.95} />
      </mesh>
      {variant === 0 && <>
        <mesh castShadow position={[0, 1.3, 0]}>
          <coneGeometry args={[0.6, 1.1, 7]} />
          <meshStandardMaterial color={leaf1} roughness={0.8} />
        </mesh>
        <mesh castShadow position={[0, 2.0, 0]}>
          <coneGeometry args={[0.42, 0.85, 7]} />
          <meshStandardMaterial color={leaf2} roughness={0.8} />
        </mesh>
        <mesh castShadow position={[0, 2.6, 0]}>
          <coneGeometry args={[0.26, 0.65, 7]} />
          <meshStandardMaterial color="#8de0a0" roughness={0.8} />
        </mesh>
      </>}
      {variant === 1 && <>
        <mesh castShadow position={[0, 1.6, 0]}>
          <sphereGeometry args={[0.7, 10, 10]} />
          <meshStandardMaterial color={leaf1} roughness={0.8} />
        </mesh>
        <mesh castShadow position={[0.3, 1.9, 0.2]}>
          <sphereGeometry args={[0.38, 8, 8]} />
          <meshStandardMaterial color={leaf2} roughness={0.8} />
        </mesh>
      </>}
      {variant === 2 && <>
        <mesh castShadow position={[0, 1.4, 0]}>
          <coneGeometry args={[0.5, 0.9, 6]} />
          <meshStandardMaterial color={leaf1} roughness={0.85} />
        </mesh>
        <mesh castShadow position={[0.15, 2.0, 0]}>
          <coneGeometry args={[0.32, 0.7, 6]} />
          <meshStandardMaterial color={leaf2} roughness={0.85} />
        </mesh>
      </>}
    </group>
  )
}

function Mushroom({ normal, position, scale = 1 }) {
  const q = useMemo(() => alignToNormal(normal), [normal])
  return (
    <group position={position} quaternion={q} scale={scale}>
      <mesh castShadow position={[0, 0.18, 0]}>
        <cylinderGeometry args={[0.07, 0.09, 0.36, 7]} />
        <meshStandardMaterial color="#f0e8d8" roughness={0.9} />
      </mesh>
      <mesh castShadow position={[0, 0.46, 0]}>
        <sphereGeometry args={[0.22, 8, 6, 0, Math.PI * 2, 0, Math.PI * 0.6]} />
        <meshStandardMaterial color="#e88a9a" roughness={0.7} />
      </mesh>
      {[0, 1, 2].map(i => (
        <mesh key={i} position={[
          Math.cos(i * 2.1) * 0.1,
          0.54,
          Math.sin(i * 2.1) * 0.1
        ]}>
          <sphereGeometry args={[0.04, 5, 5]} />
          <meshStandardMaterial color="#ffffff" roughness={0.5} />
        </mesh>
      ))}
    </group>
  )
}

// ─── HOME HILL decorations ───────────────────────────────────────────────────
function CozyCottage({ normal, position, scale = 1 }) {
  const q = useMemo(() => alignToNormal(normal), [normal])
  return (
    <group position={position} quaternion={q} scale={scale}>
      <mesh castShadow position={[0, 0.45, 0]}>
        <boxGeometry args={[0.9, 0.9, 0.75]} />
        <meshStandardMaterial color="#f9e8d0" roughness={0.8} />
      </mesh>
      <mesh castShadow position={[0, 1.05, 0]}>
        <coneGeometry args={[0.72, 0.6, 4]} />
        <meshStandardMaterial color="#e88080" roughness={0.7} />
      </mesh>
      <mesh position={[0, 0.28, 0.38]}>
        <boxGeometry args={[0.2, 0.38, 0.02]} />
        <meshStandardMaterial color="#c07840" roughness={0.9} />
      </mesh>
      <mesh position={[0.28, 0.52, 0.38]}>
        <boxGeometry args={[0.18, 0.18, 0.02]} />
        <meshStandardMaterial color="#c8e8f8" roughness={0.2} metalness={0.1} />
      </mesh>
      <mesh position={[-0.28, 0.52, 0.38]}>
        <boxGeometry args={[0.18, 0.18, 0.02]} />
        <meshStandardMaterial color="#c8e8f8" roughness={0.2} metalness={0.1} />
      </mesh>
      <mesh castShadow position={[0.25, 1.2, 0]}>
        <boxGeometry args={[0.12, 0.35, 0.12]} />
        <meshStandardMaterial color="#c87070" roughness={0.85} />
      </mesh>
      {[-0.5, 0.5].map((x, i) => (
        <mesh key={i} castShadow position={[x, 0.16, 0.55]}>
          <boxGeometry args={[0.06, 0.32, 0.06]} />
          <meshStandardMaterial color="#e8c890" roughness={0.9} />
        </mesh>
      ))}
      <mesh position={[0, 0.22, 0.55]}>
        <boxGeometry args={[1.1, 0.05, 0.04]} />
        <meshStandardMaterial color="#e8c890" roughness={0.9} />
      </mesh>
    </group>
  )
}

function FlowerPatch({ normal, position, scale = 1 }) {
  const q = useMemo(() => alignToNormal(normal), [normal])
  const flowers = useMemo(() => [
    { x: 0, z: 0, color: '#ffb8c8' },
    { x: 0.18, z: 0.1, color: '#ffd8a0' },
    { x: -0.15, z: 0.12, color: '#d8b8f8' },
    { x: 0.05, z: -0.18, color: '#a8e8b8' },
    { x: -0.2, z: -0.08, color: '#f8c0d0' },
  ], [])
  return (
    <group position={position} quaternion={q} scale={scale}>
      {flowers.map((f, i) => (
        <group key={i} position={[f.x, 0, f.z]}>
          <mesh position={[0, 0.15, 0]}>
            <cylinderGeometry args={[0.02, 0.02, 0.3, 5]} />
            <meshStandardMaterial color="#90c878" roughness={0.9} />
          </mesh>
          <mesh position={[0, 0.31, 0]}>
            <sphereGeometry args={[0.08, 7, 7]} />
            <meshStandardMaterial color={f.color} roughness={0.6} />
          </mesh>
        </group>
      ))}
    </group>
  )
}

// ─── FUTURE CITY decorations ─────────────────────────────────────────────────
function CitySpire({ normal, position, scale = 1, color = '#c8d8f0', glowColor = '#a0b8ff' }) {
  const q = useMemo(() => alignToNormal(normal), [normal])
  return (
    <group position={position} quaternion={q} scale={scale}>
      <mesh castShadow position={[0, 0.2, 0]}>
        <boxGeometry args={[0.35, 0.4, 0.35]} />
        <meshStandardMaterial color={color} roughness={0.3} metalness={0.4} />
      </mesh>
      <mesh castShadow position={[0, 0.75, 0]}>
        <boxGeometry args={[0.24, 0.7, 0.24]} />
        <meshStandardMaterial color={color} roughness={0.25} metalness={0.5} />
      </mesh>
      <mesh castShadow position={[0, 1.3, 0]}>
        <boxGeometry args={[0.16, 0.6, 0.16]} />
        <meshStandardMaterial color="#dce8ff" roughness={0.2} metalness={0.6} />
      </mesh>
      <mesh castShadow position={[0, 1.75, 0]}>
        <coneGeometry args={[0.1, 0.45, 6]} />
        <meshStandardMaterial color={glowColor} roughness={0.1} metalness={0.8} emissive={glowColor} emissiveIntensity={0.3} />
      </mesh>
      <mesh position={[0, 2.0, 0]}>
        <sphereGeometry args={[0.07, 8, 8]} />
        <meshStandardMaterial color="#ffffff" emissive={glowColor} emissiveIntensity={1.2} />
      </mesh>
      {[0.55, 0.75, 0.95, 1.15].map((y, i) => (
        <mesh key={i} position={[0.125, y, 0]}>
          <boxGeometry args={[0.01, 0.06, 0.08]} />
          <meshStandardMaterial color={glowColor} emissive={glowColor} emissiveIntensity={0.8} />
        </mesh>
      ))}
    </group>
  )
}

function FloatingRing({ normal, position, scale = 1 }) {
  const q = useMemo(() => alignToNormal(normal), [normal])
  const ringRef = useRef()
  useFrame(({ clock }) => {
    if (ringRef.current) {
      ringRef.current.rotation.z = clock.getElapsedTime() * 0.4
      ringRef.current.position.y = 1.6 + Math.sin(clock.getElapsedTime() * 0.8) * 0.08
    }
  })
  return (
    <group position={position} quaternion={q} scale={scale}>
      <group ref={ringRef} position={[0, 1.6, 0]}>
        <mesh>
          <torusGeometry args={[0.28, 0.03, 8, 24]} />
          <meshStandardMaterial color="#c0d0ff" emissive="#8090e0" emissiveIntensity={0.6} metalness={0.7} roughness={0.2} />
        </mesh>
      </group>
    </group>
  )
}

// ─── Zone ground patches ─────────────────────────────────────────────────────
function ZonePatch({ zone }) {
  const geometry = useMemo(() => {
    const { center, angularRadius, groundColor } = zone
    const geo = new THREE.BufferGeometry()
    const segs = 48
    const verts = []
    const normals = []
    const uvs = []
    const indices = []

    const q = new THREE.Quaternion()
    q.setFromUnitVectors(new THREE.Vector3(0, 1, 0), center.clone().normalize())

    const R = PLANET_RADIUS + 0.02

    const cp = center.clone().multiplyScalar(R)
    verts.push(cp.x, cp.y, cp.z)
    normals.push(center.x, center.y, center.z)
    uvs.push(0.5, 0.5)

    for (let i = 0; i <= segs; i++) {
      const angle = (i / segs) * Math.PI * 2
      const local = new THREE.Vector3(
        Math.sin(angularRadius) * Math.cos(angle),
        Math.cos(angularRadius),
        Math.sin(angularRadius) * Math.sin(angle)
      )
      local.applyQuaternion(q).normalize().multiplyScalar(R)
      verts.push(local.x, local.y, local.z)
      const n = local.clone().normalize()
      normals.push(n.x, n.y, n.z)
      uvs.push(0.5 + 0.5 * Math.cos(angle), 0.5 + 0.5 * Math.sin(angle))
    }

    for (let i = 1; i <= segs; i++) {
      indices.push(0, i, i + 1)
    }

    geo.setAttribute('position', new THREE.Float32BufferAttribute(verts, 3))
    geo.setAttribute('normal', new THREE.Float32BufferAttribute(normals, 3))
    geo.setAttribute('uv', new THREE.Float32BufferAttribute(uvs, 2))
    geo.setIndex(indices)
    geo.computeVertexNormals()

    return geo
  }, [zone])

  return (
    <mesh geometry={geometry} receiveShadow>
      <meshStandardMaterial
        color={zone.groundColor}
        roughness={0.88}
        metalness={0.02}
        depthWrite={true}
      />
    </mesh>
  )
}

// ─── Zone label billboard ────────────────────────────────────────────────────
function ZoneLabel({ zone }) {
  const pos = useMemo(() =>
    zone.center.clone().multiplyScalar(PLANET_RADIUS + 2.8),
    [zone]
  )

  const texture = useMemo(() => {
    const canvas = document.createElement('canvas')
    canvas.width = 320
    canvas.height = 80
    const ctx = canvas.getContext('2d')

    ctx.fillStyle = 'rgba(20, 10, 40, 0.7)'
    const rx = 20
    ctx.beginPath()
    ctx.moveTo(rx, 0)
    ctx.lineTo(320 - rx, 0)
    ctx.quadraticCurveTo(320, 0, 320, rx)
    ctx.lineTo(320, 80 - rx)
    ctx.quadraticCurveTo(320, 80, 320 - rx, 80)
    ctx.lineTo(rx, 80)
    ctx.quadraticCurveTo(0, 80, 0, 80 - rx)
    ctx.lineTo(0, rx)
    ctx.quadraticCurveTo(0, 0, rx, 0)
    ctx.closePath()
    ctx.fill()

    ctx.strokeStyle = 'rgba(200, 160, 255, 0.5)'
    ctx.lineWidth = 2
    ctx.stroke()

    ctx.font = '28px serif'
    ctx.fillText(zone.emoji, 14, 52)

    ctx.font = 'bold 22px Georgia, serif'
    ctx.fillStyle = '#f0d8ff'
    ctx.fillText(zone.name, 56, 50)

    const tex = new THREE.CanvasTexture(canvas)
    return tex
  }, [zone])

  return (
    <sprite position={pos} scale={[3.2, 0.8, 1]}>
      <spriteMaterial map={texture} transparent opacity={0.92} depthWrite={false} sizeAttenuation={true} />
    </sprite>
  )
}

// ─── Subtle signature — her name, quietly placed near Home Hill ─────────────
// Deliberately understated: soft, semi-transparent, script-style, tucked
// just off the cottage rather than shouted from the middle of a zone.
function NameSignature() {
  const pos = useMemo(() => {
    const zone = ZONES.HOME
    const q = new THREE.Quaternion()
    q.setFromUnitVectors(new THREE.Vector3(0, 1, 0), zone.center.clone().normalize())
    const local = new THREE.Vector3(
      Math.sin(0.32) * Math.cos(2.05),
      Math.cos(0.32),
      Math.sin(0.32) * Math.sin(2.05)
    )
    local.applyQuaternion(q).normalize()
    return local.multiplyScalar(PLANET_RADIUS + 1.15)
  }, [])

  const texture = useMemo(() => {
    const canvas = document.createElement('canvas')
    canvas.width = 560
    canvas.height = 140
    const ctx = canvas.getContext('2d')

    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'

    ctx.shadowColor = 'rgba(190, 150, 255, 0.55)'
    ctx.shadowBlur = 16
    ctx.font = 'italic 42px Georgia, serif'
    ctx.fillStyle = 'rgba(240, 226, 255, 0.82)'
    ctx.fillText('for ' + PARTNER_NAME, 280, 62)

    ctx.shadowBlur = 8
    ctx.font = '22px Georgia, serif'
    ctx.fillStyle = 'rgba(255, 205, 225, 0.7)'
    ctx.fillText('♡', 280, 102)

    return new THREE.CanvasTexture(canvas)
  }, [])

  return (
    <sprite position={pos} scale={[4.6, 1.15, 1]}>
      <spriteMaterial map={texture} transparent opacity={0.78} depthWrite={false} sizeAttenuation />
    </sprite>
  )
}

// ─── Per-zone decoration placement ───────────────────────────────────────────
function useZoneDecorations() {
  return useMemo(() => {
    const result = { BEACH: [], FOREST: [], HOME: [], CITY: [] }

    function scatter(zoneKey, count, minAngle = 0.08) {
      const zone = ZONES[zoneKey]
      const q = new THREE.Quaternion()
      q.setFromUnitVectors(new THREE.Vector3(0, 1, 0), zone.center.clone().normalize())

      const items = []
      let seed = zoneKey.charCodeAt(0) * 7 + 13
      const rand = () => {
        seed = (seed * 1664525 + 1013904223) & 0x7fffffff
        return seed / 0x7fffffff
      }

      for (let i = 0; i < count; i++) {
        const r = minAngle + rand() * (zone.angularRadius * 0.85 - minAngle)
        const angle = rand() * Math.PI * 2
        const local = new THREE.Vector3(
          Math.sin(r) * Math.cos(angle),
          Math.cos(r),
          Math.sin(r) * Math.sin(angle)
        )
        local.applyQuaternion(q).normalize()
        const position = local.clone().multiplyScalar(PLANET_RADIUS + 0.04)
        items.push({ normal: local, position, seed: rand() })
      }
      return items
    }

    result.BEACH = scatter('BEACH', 18)
    result.FOREST = scatter('FOREST', 22)
    result.HOME = scatter('HOME', 14)
    result.CITY = scatter('CITY', 16)

    return result
  }, [])
}

// ─── Zone decoration renderers ───────────────────────────────────────────────
function BeachZone({ items }) {
  return items.map((item, i) => {
    const t = item.seed
    if (t < 0.3) {
      return (
        <BeachUmbrella
          key={i}
          normal={item.normal}
          position={item.position}
          color={['#f9a8d4', '#fcd34d', '#86efac', '#c4b5fd'][i % 4]}
          scale={0.45 + t * 0.25}
        />
      )
    } else if (t < 0.65) {
      return <Seashell key={i} normal={item.normal} position={item.position} scale={0.5 + t * 0.5} />
    } else {
      return <WaveArc key={i} normal={item.normal} position={item.position} scale={0.6 + t * 0.4} />
    }
  })
}

function ForestZone({ items }) {
  return items.map((item, i) => {
    const t = item.seed
    if (t < 0.75) {
      return (
        <ForestTree
          key={i}
          normal={item.normal}
          position={item.position}
          scale={0.42 + t * 0.28}
          variant={i % 3}
        />
      )
    } else {
      return <Mushroom key={i} normal={item.normal} position={item.position} scale={0.5 + t * 0.4} />
    }
  })
}

function HomeZone({ items }) {
  return items.map((item, i) => {
    const t = item.seed
    if (i === 0 || t < 0.22) {
      return (
        <CozyCottage
          key={i}
          normal={item.normal}
          position={item.position}
          scale={0.55 + (i === 0 ? 0.2 : t * 0.15)}
        />
      )
    } else {
      return <FlowerPatch key={i} normal={item.normal} position={item.position} scale={0.5 + t * 0.5} />
    }
  })
}

function CityZone({ items }) {
  const colors = [
    { color: '#c8d8f0', glow: '#a0b8ff' },
    { color: '#d4b8f0', glow: '#c090ff' },
    { color: '#b8d0e8', glow: '#80c0ff' },
    { color: '#e0c8f0', glow: '#d080ff' },
  ]
  return items.map((item, i) => {
    const t = item.seed
    const c = colors[i % colors.length]
    if (t < 0.65) {
      return (
        <CitySpire
          key={i}
          normal={item.normal}
          position={item.position}
          scale={0.5 + t * 0.5}
          color={c.color}
          glowColor={c.glow}
        />
      )
    } else {
      return <FloatingRing key={i} normal={item.normal} position={item.position} scale={0.6 + t * 0.3} />
    }
  })
}

// ─── Ocean for the beach ─────────────────────────────────────────────────────
function BeachOcean() {
  const meshRef = useRef()
  useFrame(({ clock }) => {
    if (meshRef.current) {
      meshRef.current.material.opacity = 0.38 + Math.sin(clock.getElapsedTime() * 0.6) * 0.06
    }
  })
  const zone = ZONES.BEACH
  const geo = useMemo(() => {
    const q = new THREE.Quaternion()
    q.setFromUnitVectors(new THREE.Vector3(0, 1, 0), zone.center.clone().normalize())
    const R = PLANET_RADIUS + 0.01
    const segs = 36
    const verts = []
    const normals = []
    const indices = []
    const cp = zone.center.clone().multiplyScalar(R)
    verts.push(cp.x, cp.y, cp.z)
    normals.push(zone.center.x, zone.center.y, zone.center.z)
    for (let i = 0; i <= segs; i++) {
      const angle = (i / segs) * Math.PI * 2
      const ar = zone.angularRadius * 0.55
      const local = new THREE.Vector3(
        Math.sin(ar) * Math.cos(angle),
        Math.cos(ar),
        Math.sin(ar) * Math.sin(angle)
      )
      local.applyQuaternion(q).normalize().multiplyScalar(R)
      verts.push(local.x, local.y, local.z)
      const n = local.clone().normalize()
      normals.push(n.x, n.y, n.z)
    }
    for (let i = 1; i <= segs; i++) {
      indices.push(0, i, i + 1)
    }
    const geometry = new THREE.BufferGeometry()
    geometry.setAttribute('position', new THREE.Float32BufferAttribute(verts, 3))
    geometry.setAttribute('normal', new THREE.Float32BufferAttribute(normals, 3))
    geometry.setIndex(indices)
    geometry.computeVertexNormals()
    return geometry
  }, [zone])

  return (
    <mesh ref={meshRef} geometry={geo}>
      <meshStandardMaterial
        color="#6ab8d8"
        transparent
        opacity={0.4}
        roughness={0.1}
        metalness={0.3}
        depthWrite={false}
      />
    </mesh>
  )
}

// ─── Main Planet component ───────────────────────────────────────────────────
export default function Planet() {
  const cloudsRef = useRef()
  const decorations = useZoneDecorations()

  useFrame((_, delta) => {
    if (cloudsRef.current) {
      cloudsRef.current.rotation.y += delta * 0.015
    }
  })

  return (
    <group>
      <mesh receiveShadow castShadow>
        <sphereGeometry args={[PLANET_RADIUS, 64, 64]} />
        <meshStandardMaterial color={COLORS.planetBase} roughness={0.85} metalness={0.05} />
      </mesh>

      {Object.values(ZONES).map((zone, i) => (
        <ZonePatch key={i} zone={zone} />
      ))}

      <BeachOcean />

      <mesh position={[0, PLANET_RADIUS * 0.72, 0]}>
        <sphereGeometry args={[PLANET_RADIUS * 0.45, 32, 32]} />
        <meshStandardMaterial color={COLORS.planetPole} roughness={0.9} transparent opacity={0.6} depthWrite={false} />
      </mesh>

      <mesh position={[0, -PLANET_RADIUS * 0.72, 0]}>
        <sphereGeometry args={[PLANET_RADIUS * 0.38, 32, 32]} />
        <meshStandardMaterial color="#d4f0fa" roughness={0.9} transparent opacity={0.5} depthWrite={false} />
      </mesh>

      <mesh>
        <sphereGeometry args={[PLANET_RADIUS + 0.55, 48, 48]} />
        <meshStandardMaterial color="#c8b4f0" transparent opacity={0.07} side={THREE.BackSide} depthWrite={false} />
      </mesh>

      <group ref={cloudsRef}>
        <mesh>
          <sphereGeometry args={[PLANET_RADIUS + 0.22, 48, 48]} />
          <meshStandardMaterial color="#ffffff" transparent opacity={0.10} roughness={1} depthWrite={false} />
        </mesh>
      </group>

      <BeachZone items={decorations.BEACH} />
      <ForestZone items={decorations.FOREST} />
      <HomeZone items={decorations.HOME} />
      <CityZone items={decorations.CITY} />

      {Object.values(ZONES).map((zone, i) => (
        <ZoneLabel key={i} zone={zone} />
      ))}

      <NameSignature />
    </group>
  )
}
