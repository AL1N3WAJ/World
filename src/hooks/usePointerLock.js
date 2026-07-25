import { useEffect, useRef, useCallback } from 'react'

export function usePointerLock(active, paused = false) {
  const euler = useRef({ yaw: 0, pitch: 0 })
  const locked = useRef(false)

  const lock = useCallback(() => {
    if (paused) return
    document.body.requestPointerLock()
  }, [paused])

  useEffect(() => {
    if (!active) return

    const onMove = (e) => {
      if (!locked.current || paused) return
      const sensitivity = 0.002
      euler.current.yaw -= e.movementX * sensitivity
      euler.current.pitch -= e.movementY * sensitivity
      euler.current.pitch = Math.max(-Math.PI / 3, Math.min(Math.PI / 3, euler.current.pitch))
    }

    const onLockChange = () => {
      locked.current = document.pointerLockElement === document.body
    }

    document.addEventListener('mousemove', onMove)
    document.addEventListener('pointerlockchange', onLockChange)
    document.addEventListener('click', lock)

    return () => {
      document.removeEventListener('mousemove', onMove)
      document.removeEventListener('pointerlockchange', onLockChange)
      document.removeEventListener('click', lock)
    }
  }, [active, lock, paused])

  useEffect(() => {
    if (paused && document.pointerLockElement) {
      document.exitPointerLock()
    }
  }, [paused])

  return { euler, locked }
}
