import React, { useState, useEffect, useRef } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import { ZONES, getZone } from '../utils/constants'

// Runs inside the Canvas to detect zone from camera position each frame
export function ZoneDetector({ onZoneChange }) {
  const { camera } = useThree()
  const lastZone = useRef(null)

  useFrame(() => {
    const pos = camera.position.clone().normalize()
    const zoneKey = getZone(pos)
    if (zoneKey !== lastZone.current) {
      lastZone.current = zoneKey
      onZoneChange(zoneKey)
    }
  })

  return null
}

function PillButton({ onClick, children, style }) {
  return (
    <button
      onClick={onClick}
      style={{
        background: 'rgba(15, 5, 30, 0.55)',
        border: '1px solid rgba(200, 150, 255, 0.22)',
        borderRadius: '999px',
        padding: '8px 14px',
        backdropFilter: 'blur(6px)',
        color: '#e8d4f8',
        fontSize: '13px',
        letterSpacing: '0.03em',
        cursor: 'pointer',
        fontFamily: 'Georgia, serif',
        transition: 'all 0.3s ease',
        ...style,
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.background = 'rgba(180, 120, 240, 0.2)'
        e.currentTarget.style.borderColor = 'rgba(220, 170, 255, 0.5)'
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.background = 'rgba(15, 5, 30, 0.55)'
        e.currentTarget.style.borderColor = 'rgba(200, 150, 255, 0.22)'
      }}
    >
      {children}
    </button>
  )
}

export default function HUD({
  currentZone,
  foundCount = 0,
  totalCount = 0,
  muted = false,
  onToggleMute,
  onGoHome,
}) {
  const [controlsVisible, setControlsVisible] = useState(true)
  const [zoneAnim, setZoneAnim] = useState(false)
  const prevZone = useRef(null)

  useEffect(() => {
    const timer = setTimeout(() => setControlsVisible(false), 6000)
    return () => clearTimeout(timer)
  }, [])

  useEffect(() => {
    if (currentZone && currentZone !== prevZone.current) {
      prevZone.current = currentZone
      setZoneAnim(true)
      const t = setTimeout(() => setZoneAnim(false), 2800)
      return () => clearTimeout(t)
    }
  }, [currentZone])

  const zone = currentZone ? ZONES[currentZone] : null

  return (
    <>
      {/* ── Zone entrance banner ── */}
      <div
        style={{
          position: 'absolute',
          top: '42%',
          left: '50%',
          transform: `translate(-50%, -50%) scale(${zoneAnim && zone ? 1 : 0.92})`,
          pointerEvents: 'none',
          transition: 'opacity 0.8s cubic-bezier(0.16, 1, 0.3, 1), transform 0.8s cubic-bezier(0.16, 1, 0.3, 1)',
          opacity: zoneAnim && zone ? 1 : 0,
          textAlign: 'center',
        }}
      >
        <div
          style={{
            fontSize: '40px',
            marginBottom: '8px',
            filter: 'drop-shadow(0 0 18px rgba(255,200,230,0.5))',
          }}
        >
          {zone?.emoji}
        </div>
        <div
          style={{
            fontFamily: 'Georgia, serif',
            fontSize: 'clamp(18px, 3vw, 26px)',
            color: '#f0d8ff',
            letterSpacing: '0.14em',
            textShadow: '0 0 40px rgba(180, 120, 240, 0.9), 0 2px 4px rgba(0,0,0,0.8)',
            fontStyle: 'italic',
          }}
        >
          {zone?.name}
        </div>
      </div>

      {/* ── Current zone + notes found — top right ── */}
      <div
        className="absolute top-4 right-4 pointer-events-none"
        style={{
          background: 'rgba(15, 5, 30, 0.55)',
          border: '1px solid rgba(200, 150, 255, 0.22)',
          borderRadius: '12px',
          padding: '8px 14px',
          backdropFilter: 'blur(6px)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-end',
          gap: '4px',
          transition: 'box-shadow 0.6s ease',
          boxShadow: zoneAnim ? '0 0 24px rgba(200,140,255,0.25)' : '0 0 0 rgba(0,0,0,0)',
        }}
      >
        <div style={{ color: 'rgba(200, 160, 255, 0.6)', fontSize: '10px', letterSpacing: '0.1em' }}>
          🌍 OUR LITTLE PLANET
        </div>
        {zone ? (
          <div style={{ color: '#f0d0ff', fontSize: '11px', letterSpacing: '0.05em' }}>
            {zone.emoji} {zone.name}
          </div>
        ) : (
          <div style={{ color: 'rgba(180, 140, 220, 0.45)', fontSize: '11px' }}>
            Between worlds…
          </div>
        )}
        <div
          style={{
            color: '#ffc8e0',
            fontSize: '11px',
            letterSpacing: '0.05em',
            marginTop: '2px',
            paddingTop: '4px',
            borderTop: '1px solid rgba(200,150,255,0.15)',
            width: '100%',
            textAlign: 'right',
          }}
        >
          ♡ {foundCount} / {totalCount} notes found
        </div>
      </div>

      {/* ── Mute + Home — top left, soft pill buttons ── */}
      <div className="absolute top-4 left-4" style={{ display: 'flex', gap: '10px' }}>
        <PillButton onClick={onToggleMute}>
          {muted ? '🔇 muted' : '🔊 sound'}
        </PillButton>
        <PillButton onClick={onGoHome} style={{ opacity: 0.92 }}>
          🏡 home
        </PillButton>
      </div>

      {/* ── Controls hint — fades away ── */}
      <div
        className="absolute bottom-8 left-1/2 -translate-x-1/2 pointer-events-none"
        style={{
          transition: 'opacity 1.5s ease, transform 1.5s ease',
          opacity: controlsVisible ? 1 : 0,
          transform: controlsVisible ? 'translateY(0)' : 'translateY(8px)',
          whiteSpace: 'nowrap',
        }}
      >
        <div
          style={{
            background: 'rgba(15, 5, 30, 0.65)',
            border: '1px solid rgba(200, 150, 255, 0.25)',
            borderRadius: '16px',
            padding: '14px 28px',
            color: '#e8d4f8',
            fontSize: '13px',
            letterSpacing: '0.04em',
            textAlign: 'center',
            backdropFilter: 'blur(8px)',
            lineHeight: 1.9,
          }}
        >
          <div style={{ color: '#f0c8e8', marginBottom: '4px', fontSize: '14px' }}>
            ✦ Our Little Planet ✦
          </div>
          <span style={{ opacity: 0.8 }}>WASD</span> walk &nbsp;·&nbsp;
          <span style={{ opacity: 0.8 }}>Mouse</span> look &nbsp;·&nbsp;
          <span style={{ opacity: 0.8 }}>Space</span> jump &nbsp;·&nbsp;
          <span style={{ opacity: 0.8 }}>Click</span> glowing objects to read
          <div style={{ marginTop: '5px', fontSize: '11px', opacity: 0.5, letterSpacing: '0.08em' }}>
            🌊 Beach &nbsp;·&nbsp; 🌿 Forest &nbsp;·&nbsp; 🏡 Home Hill &nbsp;·&nbsp; ✨ Future City
          </div>
        </div>
      </div>
    </>
  )
}
