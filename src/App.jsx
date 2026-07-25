import React, { useState, useCallback, useEffect, useRef } from 'react'
import { Canvas } from '@react-three/fiber'
import * as THREE from 'three'
import PlanetScene from './scenes/PlanetScene'
import HUD from './components/HUD'
import StartScreen from './components/StartScreen'
import LoveNoteOverlay from './components/LoveNoteOverlay'
import FinalLetter from './components/FinalLetter'
import LoadingScreen from './components/LoadingScreen'
import { getAllNotesFlat } from './utils/loveNotes'
import { useAudio } from './hooks/useAudio'

const TOTAL_NOTES = getAllNotesFlat().length

export default function App() {
  const [started, setStarted] = useState(false)
  const [currentZone, setCurrentZone] = useState(null)
  const [openNote, setOpenNote] = useState(null)
  const [foundIds, setFoundIds] = useState(() => new Set())
  const [loading, setLoading] = useState(true)
  const [progress, setProgress] = useState(0)
  const [showFinalLetter, setShowFinalLetter] = useState(false)
  const finalLetterShownRef = useRef(false)

  const { unlock, playFootstep, playChime, toggleMute, muted } = useAudio()

  // Shared refs: the Player writes its live world position here every
  // frame; the Companion and reactive particles read from it. A separate
  // imperative ref lets the "Home" button call Player.goHome() directly.
  const playerRef = useRef(null)
  const playerPosRef = useRef(new THREE.Vector3())

  const progressTimerRef = useRef(null)
  useEffect(() => {
    let p = 0
    progressTimerRef.current = setInterval(() => {
      p += 6 + Math.random() * 10
      if (p >= 100) {
        p = 100
        setProgress(100)
        clearInterval(progressTimerRef.current)
        setTimeout(() => setLoading(false), 350)
      } else {
        setProgress(p)
      }
    }, 140)
    return () => clearInterval(progressTimerRef.current)
  }, [])

  const handleZoneChange = useCallback((zoneKey) => {
    setCurrentZone(zoneKey)
  }, [])

  const handleOpenNote = useCallback((note) => {
    setOpenNote(note)
    setFoundIds((prev) => {
      const next = new Set(prev)
      next.add(note.id)
      return next
    })
  }, [])

  const handleCloseNote = useCallback(() => {
    setOpenNote(null)
  }, [])

  const handleStart = useCallback(() => {
    setStarted(true)
    unlock()
  }, [unlock])

  const handleGoHome = useCallback(() => {
    playerRef.current?.goHome()
  }, [])

  const handleCloseFinalLetter = useCallback(() => {
    setShowFinalLetter(false)
  }, [])

  // When every love note across the whole planet has been found, surface
  // the special final letter — once — after a brief, gentle pause so it
  // doesn't collide with the note the player just closed.
  useEffect(() => {
    if (foundIds.size === TOTAL_NOTES && !finalLetterShownRef.current) {
      finalLetterShownRef.current = true
      const t = setTimeout(() => {
        setShowFinalLetter(true)
        playChime && playChime()
      }, 900)
      return () => clearTimeout(t)
    }
  }, [foundIds, playChime])

  return (
    <div className="w-full h-full relative">
      <Canvas
        shadows
        camera={{ fov: 70, near: 0.05, far: 300 }}
        gl={{ antialias: true, powerPreference: 'high-performance' }}
        scene={{ background: null }}
        dpr={[1, 1.75]}
      >
        <PlanetScene
          active={started}
          paused={!!openNote || showFinalLetter}
          onZoneChange={handleZoneChange}
          onOpenNote={handleOpenNote}
          openNoteId={openNote?.id ?? null}
          onFootstep={playFootstep}
          playerRef={playerRef}
          playerPosRef={playerPosRef}
        />
      </Canvas>

      {loading && <LoadingScreen progress={progress} visible={loading} />}

      {!loading && !started && <StartScreen onStart={handleStart} />}
      {!loading && started && (
        <HUD
          currentZone={currentZone}
          foundCount={foundIds.size}
          totalCount={TOTAL_NOTES}
          muted={muted}
          onToggleMute={toggleMute}
          onGoHome={handleGoHome}
        />
      )}

      <LoveNoteOverlay note={openNote} onClose={handleCloseNote} />
      <FinalLetter open={showFinalLetter} onClose={handleCloseFinalLetter} />
    </div>
  )
}
