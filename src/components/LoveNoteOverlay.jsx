import React, { useEffect, useState } from 'react'

export default function LoveNoteOverlay({ note, onClose }) {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    if (note) {
      const t = setTimeout(() => setVisible(true), 20)
      return () => clearTimeout(t)
    } else {
      setVisible(false)
    }
  }, [note])

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape') handleClose()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [note])

  if (!note) return null

  function handleClose() {
    setVisible(false)
    setTimeout(onClose, 350)
  }

  return (
    <div
      onClick={handleClose}
      style={{
        position: 'absolute',
        inset: 0,
        zIndex: 50,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: visible ? 'rgba(10, 4, 20, 0.55)' : 'rgba(10, 4, 20, 0)',
        backdropFilter: visible ? 'blur(6px)' : 'blur(0px)',
        transition: 'background 0.4s ease, backdrop-filter 0.4s ease',
        cursor: 'pointer',
        padding: '24px',
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          position: 'relative',
          maxWidth: '440px',
          width: '100%',
          cursor: 'default',
          transform: visible ? 'translateY(0) scale(1)' : 'translateY(18px) scale(0.96)',
          opacity: visible ? 1 : 0,
          transition: 'transform 0.5s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.4s ease',
        }}
      >
        <div
          style={{
            position: 'absolute',
            inset: '-40px',
            background: 'radial-gradient(circle, rgba(255,170,210,0.25) 0%, rgba(180,120,240,0.12) 45%, transparent 70%)',
            pointerEvents: 'none',
            animation: visible ? 'noteglow 3.2s ease-in-out infinite' : 'none',
          }}
        />

        <div
          style={{
            position: 'relative',
            background: 'linear-gradient(160deg, rgba(38, 18, 58, 0.92), rgba(24, 10, 42, 0.95))',
            border: '1px solid rgba(220, 170, 255, 0.28)',
            borderRadius: '20px',
            padding: '38px 34px 30px',
            boxShadow: '0 20px 60px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.06)',
          }}
        >
          <div
            style={{
              textAlign: 'center',
              fontSize: '26px',
              marginBottom: '6px',
              opacity: 0.9,
              animation: visible ? 'notetwinkle 2.6s ease-in-out infinite' : 'none',
            }}
          >
            ✦ ⋆ ✦
          </div>

          <h2
            style={{
              fontFamily: 'Georgia, serif',
              fontStyle: 'italic',
              fontSize: 'clamp(20px, 4vw, 26px)',
              color: '#f7dfff',
              textAlign: 'center',
              marginBottom: '18px',
              letterSpacing: '0.03em',
              textShadow: '0 0 30px rgba(200, 140, 255, 0.5)',
            }}
          >
            {note.title}
          </h2>

          <p
            style={{
              fontFamily: 'Georgia, serif',
              fontSize: '16px',
              lineHeight: 1.85,
              color: '#ecdcf7',
              textAlign: 'center',
              opacity: 0.95,
            }}
          >
            {note.message}
          </p>

          <div
            style={{
              textAlign: 'center',
              fontSize: '20px',
              marginTop: '22px',
              opacity: 0.75,
              animation: visible ? 'noteheartbeat 1.8s ease-in-out infinite' : 'none',
            }}
          >
            ♡
          </div>

          <button
            onClick={handleClose}
            style={{
              display: 'block',
              margin: '26px auto 0',
              background: 'transparent',
              border: '1px solid rgba(220, 170, 255, 0.35)',
              color: '#e8c8ff',
              padding: '10px 28px',
              borderRadius: '30px',
              fontSize: '12px',
              letterSpacing: '0.15em',
              textTransform: 'uppercase',
              cursor: 'pointer',
              fontFamily: 'Georgia, serif',
              transition: 'all 0.25s ease',
            }}
            onMouseEnter={(e) => {
              e.target.style.background = 'rgba(180, 120, 240, 0.18)'
              e.target.style.borderColor = 'rgba(220, 170, 255, 0.7)'
            }}
            onMouseLeave={(e) => {
              e.target.style.background = 'transparent'
              e.target.style.borderColor = 'rgba(220, 170, 255, 0.35)'
            }}
          >
            Close
          </button>
        </div>
      </div>

      <style>{`
        @keyframes noteglow {
          0%, 100% { opacity: 0.85; }
          50% { opacity: 1; }
        }
        @keyframes notetwinkle {
          0%, 100% { opacity: 0.7; transform: scale(1); }
          50% { opacity: 1; transform: scale(1.08); }
        }
        @keyframes noteheartbeat {
          0%, 100% { transform: scale(1); }
          25% { transform: scale(1.18); }
          40% { transform: scale(1); }
        }
      `}</style>
    </div>
  )
}
