import React, { useEffect, useState } from 'react'

export default function LoadingScreen({ progress = 0, visible = true }) {
  const [fadingOut, setFadingOut] = useState(false)

  useEffect(() => {
    if (!visible) {
      setFadingOut(true)
    }
  }, [visible])

  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        zIndex: 100,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'radial-gradient(ellipse at center, #241333 0%, #0a0612 75%)',
        transition: 'opacity 0.9s ease',
        opacity: fadingOut ? 0 : 1,
        pointerEvents: fadingOut ? 'none' : 'auto',
      }}
    >
      <div
        style={{
          position: 'relative',
          width: '110px',
          height: '110px',
          marginBottom: '38px',
        }}
      >
        <div
          style={{
            position: 'absolute',
            inset: 0,
            borderRadius: '50%',
            background:
              'radial-gradient(circle at 40% 35%, #f3d3ff, #c8a0e8 55%, #7a4fa8)',
            boxShadow: '0 0 50px 14px rgba(190, 130, 240, 0.35)',
            animation: 'loadPulse 2.4s ease-in-out infinite',
          }}
        />
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            style={{
              position: 'absolute',
              inset: 0,
              animation: `orbit ${3.6 + i * 0.5}s linear infinite`,
              animationDelay: `${i * -1.2}s`,
            }}
          >
            <span
              style={{
                position: 'absolute',
                top: '-14px',
                left: '50%',
                transform: 'translateX(-50%)',
                fontSize: 14 + i * 2,
                opacity: 0.85 - i * 0.15,
                filter: 'drop-shadow(0 0 6px rgba(255,170,220,0.7))',
              }}
            >
              ♡
            </span>
          </div>
        ))}
      </div>

      <div
        style={{
          fontFamily: 'Georgia, serif',
          fontStyle: 'italic',
          fontSize: 'clamp(18px, 3.4vw, 24px)',
          color: '#f0d8ff',
          letterSpacing: '0.08em',
          textShadow: '0 0 30px rgba(190, 130, 240, 0.5)',
          marginBottom: '14px',
        }}
      >
        preparing our little world…
      </div>

      <div
        style={{
          width: '200px',
          height: '4px',
          borderRadius: '4px',
          background: 'rgba(255,255,255,0.08)',
          overflow: 'hidden',
        }}
      >
        <div
          style={{
            height: '100%',
            width: `${Math.max(6, Math.min(100, progress))}%`,
            background:
              'linear-gradient(90deg, #f0a8d8, #c8a0f0, #a0c8f0)',
            transition: 'width 0.4s ease',
            boxShadow: '0 0 10px rgba(220, 170, 255, 0.6)',
          }}
        />
      </div>

      <div
        style={{
          marginTop: '10px',
          fontSize: '11px',
          letterSpacing: '0.15em',
          color: 'rgba(200, 170, 240, 0.55)',
          fontFamily: 'Georgia, serif',
        }}
      >
        {Math.round(progress)}%
      </div>

      <style>{`
        @keyframes loadPulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.08); }
        }
        @keyframes orbit {
          from { transform: rotate(0deg) translateX(0); }
          to { transform: rotate(360deg) translateX(0); }
        }
      `}</style>
    </div>
  )
}
