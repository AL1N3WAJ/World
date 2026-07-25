import React from 'react'
import { useThree } from '@react-three/fiber'
import { FogExp2, Color } from 'three'
import Planet from '../components/Planet'
import Player from '../components/Player'
import Companion from '../components/Companion'
import Lighting from '../components/Lighting'
import Starfield from '../components/Starfield'
import Particles from '../components/Particles'
import InteractiveObjects from '../components/InteractiveObjects'
import { ZoneDetector } from '../components/HUD'
import { COLORS } from '../utils/constants'

function SceneSetup() {
  const { scene } = useThree()
  React.useEffect(() => {
    scene.background = new Color('#160a24')
    scene.fog = new FogExp2(COLORS.fog, 0.0075)
  }, [scene])
  return null
}

export default function PlanetScene({
  active,
  paused,
  onZoneChange,
  onOpenNote,
  openNoteId,
  onFootstep,
  playerRef,
  playerPosRef,
}) {
  return (
    <>
      <SceneSetup />
      <Starfield count={2000} />
      <Particles playerPosRef={playerPosRef} />
      <Lighting />
      <Planet />
      <InteractiveObjects onOpenNote={onOpenNote} openNoteId={openNoteId} />
      <Player
        ref={playerRef}
        posRef={playerPosRef}
        active={active}
        paused={paused}
        onFootstep={onFootstep}
      />
      <Companion active={active} playerPosRef={playerPosRef} />
      {active && <ZoneDetector onZoneChange={onZoneChange} />}
    </>
  )
}
