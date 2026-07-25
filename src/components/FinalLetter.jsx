import React, { useEffect, useState } from 'react'
import { PARTNER_NAME } from '../utils/constants'

// A special, once-only letter that appears after every love note across
// the whole planet has been found. Visually related to LoveNoteOverlay but
// deliberately grander — gold-tinted, slower, more ceremonial.
export default function FinalLetter({ open, onClose }) {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    if (open) {
      const t = setTimeout(() => setVisible(true), 30)
      return () => clearTimeout(t)
    } else {
      setVisible(false)
    }
  }, [open])

  useEffect(() => {
    if (!open) return
    const onKey = (e) => {
      if (e.key === 'Escape') handleClose()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open])

  if (!open) return null

  function handleClose() {
    setVisible(false)
    setTimeout(onClose, 400)
  }

  return (
    <div
      onClick={handleClose}
      style={{
        position: 'absolute',
        inset: 0,
        zIndex: 60,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: visible ? 'rgba(8, 4, 18, 0.72)' : 'rgba(8, 4, 18, 0)',
        backdropFilter: visible ? 'blur(9px)' : 'blur(0px)',
        transition: 'background 0.6s ease, backdrop-filter 0.6s ease',
        cursor: 'pointer',
        padding: '24px',
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          position: 'relative',
          maxWidth: '480px',
          width: '100%',
          cursor: 'default',
          transform: visible ? 'translateY(0) scale(1)' : 'translateY(24px) scale(0.94)',
          opacity: visible ? 1 : 0,
          transition: 'transform 0.7s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.5s ease',
        }}
      >
        <div
          style={{
            position: 'absolute',
            inset: '-60px',
            background:
              'radial-gradient(circle, rgba(255,214,150,0.28) 0%, rgba(255,170,210,0.16) 40%, transparent 72%)',
            pointerEvents: 'none',
            animation: visible ? 'finalglow 3.6s ease-in-out infinite' : 'none',
          }}
        />

        <div
          style={{
            position: 'relative',
            background: 'linear-gradient(160deg, rgba(44, 22, 60, 0.94), rgba(20, 8, 36, 0.97))',
            border: '1px solid rgba(255, 214, 160, 0.35)',
            borderRadius: '22px',
            padding: '44px 36px 34px',
            boxShadow: '0 24px 70px rgba(0,0,0,0.55), inset 0 1px 0 rgba(255,255,255,0.07)',
          }}
        >
          <div
            style={{
              textAlign: 'center',
              fontSize: '30px',
              marginBottom: '10px',
              opacity: 0.95,
              animation: visible ? 'finaltwinkle 2.8s ease-in-out infinite' : 'none',
            }}
          >
            ✦ ⋆｡♡｡⋆ ✦
          </div>

          <div
            style={{
              textAlign: 'center',
              fontSize: '11px',
              letterSpacing: '0.28em',
              color: 'rgba(255, 214, 170, 0.75)',
              textTransform: 'uppercase',
              marginBottom: '14px',
            }}
          >
            every note, found
          </div>

          <h2
            style={{
              fontFamily: 'Georgia, serif',
              fontStyle: 'italic',
              fontSize: 'clamp(22px, 4.4vw, 30px)',
              color: '#fff2df',
              textAlign: 'center',
              marginBottom: '20px',
              letterSpacing: '0.02em',
              textShadow: '0 0 34px rgba(255, 200, 140, 0.5)',
            }}
          >
            For {PARTNER_NAME}
          </h2>

          <p
            style={{
              fontFamily: 'Georgia, serif',
              fontSize: '16px',
              lineHeight: 1.9,
              color: '#f2e2f5',
              textAlign: 'center',
              opacity: 0.96,
              marginBottom: '14px',
            }}
          >
            You found every last note hidden across this little planet —
            the beach, the forest, the hill, the city still to come. Every
            one of them was true, and none of them were the whole story.
          </p>

          <p
            style={{
              fontFamily: 'Georgia, serif',
              fontSize: '16px',
              lineHeight: 1.9,
              color: '#f2e2f5',
              textAlign: 'center',
              opacity: 0.96,
            }}
          >
            The whole story is simpler than any of them: I built you a
            world, Fariba, because you're the reason the real one feels
            worth wandering through. Thank you for finding all of it — and
            for being the person I most want to keep exploring things with.
          </p>

          <div
            style={{
              textAlign: 'center',
              fontSize: '22px',
              marginTop: '24px',
              opacity: 0.85,
              animation: visible ? 'finalheartbeat 1.8s ease-in-out infinite' : 'none',
            }}
          >
            ♡
          </div>

          <button
            onClick={handleClose}
            style={{
              display: 'block',
              margin: '28px auto 0',
              background: 'transparent',
              border: '1px solid rgba(255, 214, 170, 0.45)',
              color: '#ffe8c8',
              padding: '11px 30px',
              borderRadius: '30px',
              fontSize: '12px',
              letterSpacing: '0.15em',
              textTransform: 'uppercase',
              cursor: 'pointer',
              fontFamily: 'Georgia, serif',
              transition: 'all 0.25s ease',
            }}
            onMouseEnter={(e) => {
              e.target.style.background = 'rgba(255, 190, 120, 0.18)'
              e.target.style.borderColor = 'rgba(255, 214, 170, 0.8)'
            }}
            onMouseLeave={(e) => {
              e.target.style.background = 'transparent'
              e.target.style.borderColor = 'rgba(255, 214, 170, 0.45)'
            }}
          >
            Close
          </button>
        </div>
      </div>

      <style>{`
        @keyframes finalglow {
          0%, 100% { opacity: 0.85; }
          50% { opacity: 1; }
        }
        @keyframes finaltwinkle {
          0%, 100% { opacity: 0.75; transform: scale(1); }
          50% { opacity: 1; transform: scale(1.08); }
        }
        @keyframes finalheartbeat {
          0%, 100% { transform: scale(1); }
          25% { transform: scale(1.2); }
          40% { transform: scale(1); }
        }
      `}</style>
    </div>
  )
}
