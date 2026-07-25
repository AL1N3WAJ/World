import React, { useEffect, useState } from 'react'

export default function StartScreen({ onStart }) {
  const [ready, setReady] = useState(false)

  useEffect(() => {
    const t = setTimeout(() => setReady(true), 300)
    return () => clearTimeout(t)
  }, [])

  return (
    <div
      className="absolute inset-0 flex flex-col items-center justify-center"
      style={{
        background: 'radial-gradient(ellipse at center, #241333 0%, #0a0612 70%)',
        transition: 'opacity 0.5s ease',
        opacity: ready ? 1 : 0,
      }}
    >
      {[...Array(30)].map((_, i) => (
        <div
          key={i}
          style={{
            position: 'absolute',
            width: i % 5 === 0 ? '3px' : '2px',
            height: i % 5 === 0 ? '3px' : '2px',
            borderRadius: '50%',
            background: '#e8c8ff',
            top: `${5 + Math.sin(i * 1.7) * 45 + 45}%`,
            left: `${5 + Math.cos(i * 2.3) * 45 + 45}%`,
            opacity: 0.3 + (i % 4) * 0.15,
            animation: `twinkle ${2 + (i % 4) * 0.5}s ease-in-out ${i * 0.1}s infinite alternate`,
          }}
        />
      ))}

      <div
        style={{
          width: '120px',
          height: '120px',
          borderRadius: '50%',
          background: 'radial-gradient(circle at 35% 35%, #f8dcc0, #d8b4e8 45%, #9880c8)',
          boxShadow: '0 0 60px 20px rgba(220, 170, 140, 0.22), inset -20px -15px 40px rgba(80, 40, 120, 0.4)',
          marginBottom: '40px',
          animation: 'float 4s ease-in-out infinite',
        }}
      />

      <h1
        style={{
          fontFamily: 'Georgia, serif',
          fontSize: 'clamp(28px, 5vw, 52px)',
          color: '#f0d8ff',
          letterSpacing: '0.08em',
          marginBottom: '10px',
          textShadow: '0 0 40px rgba(180, 120, 240, 0.6)',
          fontWeight: 'normal',
        }}
      >
        Our Little Planet
      </h1>

      <p
        style={{
          color: 'rgba(200, 170, 240, 0.7)',
          fontSize: '15px',
          letterSpacing: '0.15em',
          marginBottom: '50px',
          fontFamily: 'Georgia, serif',
          fontStyle: 'italic',
        }}
      >
        a tiny world, just for us
      </p>

      <button
        onClick={onStart}
        style={{
          background: 'transparent',
          border: '1px solid rgba(200, 150, 255, 0.5)',
          color: '#e8c8ff',
          padding: '14px 40px',
          borderRadius: '40px',
          fontSize: '14px',
          letterSpacing: '0.2em',
          cursor: 'pointer',
          fontFamily: 'Georgia, serif',
          transition: 'all 0.3s ease',
          backdropFilter: 'blur(4px)',
          textTransform: 'uppercase',
        }}
        onMouseEnter={e => {
          e.target.style.background = 'rgba(180, 120, 240, 0.15)'
          e.target.style.borderColor = 'rgba(220, 170, 255, 0.8)'
          e.target.style.boxShadow = '0 0 30px rgba(180, 120, 240, 0.3)'
        }}
        onMouseLeave={e => {
          e.target.style.background = 'transparent'
          e.target.style.borderColor = 'rgba(200, 150, 255, 0.5)'
          e.target.style.boxShadow = 'none'
        }}
      >
        Begin Journey
      </button>

      <p
        style={{
          color: 'rgba(160, 130, 200, 0.5)',
          fontSize: '11px',
          letterSpacing: '0.1em',
          marginTop: '20px',
        }}
      >
        Click to capture mouse · Esc to release · 🔊 for ambient sound
      </p>

      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-12px); }
        }
        @keyframes twinkle {
          from { opacity: 0.2; }
          to { opacity: 0.9; }
        }
      `}</style>
    </div>
  )
}
