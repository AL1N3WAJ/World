import React, { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { COLORS } from '../utils/constants'

export default function Lighting() {
  const sunRef = useRef()
  const sunMeshRef = useRef()
  const fillRef = useRef()

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime() * 0.035
    const r = 60
    if (sunRef.current) {
      sunRef.current.position.set(
        Math.cos(t) * r,
        Math.sin(t * 0.35) * 16 + 20,
        Math.sin(t) * r
      )
    }
    if (sunMeshRef.current) {
      sunMeshRef.current.position.copy(sunRef.current.position)
    }
    if (fillRef.current) {
      fillRef.current.position.set(
        Math.cos(t + Math.PI) * 34,
        -8,
        Math.sin(t + Math.PI) * 34
      )
    }
  })

  return (
    <>
      <ambientLight color={COLORS.ambientLight} intensity={0.38} />
      <hemisphereLight color="#e8c8a0" groundColor="#4a2a54" intensity={0.45} />

      <directionalLight
        ref={sunRef}
        color={COLORS.sunLight}
        intensity={2.1}
        castShadow
        shadow-mapSize={[2048, 2048]}
        shadow-camera-near={1}
        shadow-camera-far={200}
        shadow-camera-left={-25}
        shadow-camera-right={25}
        shadow-camera-top={25}
        shadow-camera-bottom={-25}
        shadow-bias={-0.0015}
        shadow-radius={4}
      />

      <pointLight
        ref={fillRef}
        color={COLORS.sunLightWarm}
        intensity={0.65}
        distance={70}
        position={[30, -10, 20]}
      />

      <pointLight color="#7a5aa8" intensity={0.3} distance={50} position={[-20, 15, -20]} />

      <group ref={sunMeshRef}>
        <mesh>
          <sphereGeometry args={[2.5, 16, 16]} />
          <meshBasicMaterial color="#fff0c8" />
        </mesh>
        <mesh>
          <sphereGeometry args={[4.4, 16, 16]} />
          <meshBasicMaterial color={COLORS.goldenRim} transparent opacity={0.14} side={THREE.BackSide} />
        </mesh>
        <mesh>
          <sphereGeometry args={[6.5, 16, 16]} />
          <meshBasicMaterial color={COLORS.goldenRim} transparent opacity={0.05} side={THREE.BackSide} />
        </mesh>
      </group>
    </>
  )
}
