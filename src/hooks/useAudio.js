import { useEffect, useRef, useCallback, useState } from 'react'

export function useAudio() {
  const ctxRef = useRef(null)
  const masterGainRef = useRef(null)
  const ambientNodesRef = useRef([])
  const footstepGainRef = useRef(null)
  const [muted, setMuted] = useState(false)
  const [ready, setReady] = useState(false)
  const mutedRef = useRef(false)

  const ensureContext = useCallback(() => {
    if (ctxRef.current) return ctxRef.current
    const AudioCtx = window.AudioContext || window.webkitAudioContext
    if (!AudioCtx) return null
    const ctx = new AudioCtx()
    ctxRef.current = ctx

    const master = ctx.createGain()
    master.gain.value = 0.45
    master.connect(ctx.destination)
    masterGainRef.current = master

    const fsGain = ctx.createGain()
    fsGain.gain.value = 0.5
    fsGain.connect(master)
    footstepGainRef.current = fsGain

    setReady(true)
    return ctx
  }, [])

  const startAmbient = useCallback(() => {
    const ctx = ensureContext()
    if (!ctx || ambientNodesRef.current.length) return

    const nodes = []
    const padGain = ctx.createGain()
    padGain.gain.value = 0.0
    padGain.connect(masterGainRef.current)
    padGain.gain.linearRampToValueAtTime(0.16, ctx.currentTime + 3.5)
    nodes.push(padGain)

    const baseFreqs = [98, 123.47]
    baseFreqs.forEach((f, i) => {
      const osc = ctx.createOscillator()
      osc.type = 'sine'
      osc.frequency.value = f
      const detune = ctx.createOscillator()
      detune.type = 'sine'
      detune.frequency.value = f * 1.003
      const g = ctx.createGain()
      g.gain.value = 0.5
      osc.connect(g)
      detune.connect(g)
      g.connect(padGain)
      osc.start()
      detune.start()
      nodes.push(osc, detune, g)

      const lfo = ctx.createOscillator()
      lfo.type = 'sine'
      lfo.frequency.value = 0.06 + i * 0.015
      const lfoGain = ctx.createGain()
      lfoGain.gain.value = 0.15
      lfo.connect(lfoGain)
      lfoGain.connect(g.gain)
      lfo.start()
      nodes.push(lfo, lfoGain)
    })

    const bufferSize = 2 * ctx.sampleRate
    const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate)
    const data = noiseBuffer.getChannelData(0)
    for (let i = 0; i < bufferSize; i++) data[i] = (Math.random() * 2 - 1) * 0.5
    const noise = ctx.createBufferSource()
    noise.buffer = noiseBuffer
    noise.loop = true
    const filter = ctx.createBiquadFilter()
    filter.type = 'bandpass'
    filter.frequency.value = 3200
    filter.Q.value = 0.7
    const shimmerGain = ctx.createGain()
    shimmerGain.gain.value = 0.02
    noise.connect(filter)
    filter.connect(shimmerGain)
    shimmerGain.connect(padGain)
    noise.start()
    nodes.push(noise, filter, shimmerGain)

    ambientNodesRef.current = nodes
  }, [ensureContext])

  const stopAmbient = useCallback(() => {
    const ctx = ctxRef.current
    if (!ctx) return
    ambientNodesRef.current.forEach((n) => {
      try {
        if (n.stop) n.stop()
        n.disconnect()
      } catch (e) {
        /* already stopped */
      }
    })
    ambientNodesRef.current = []
  }, [])

  const playFootstep = useCallback(() => {
    const ctx = ctxRef.current
    if (!ctx || mutedRef.current) return

    const now = ctx.currentTime
    const dur = 0.09
    const bufferSize = Math.floor(ctx.sampleRate * dur)
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate)
    const data = buffer.getChannelData(0)
    for (let i = 0; i < bufferSize; i++) {
      const decay = 1 - i / bufferSize
      data[i] = (Math.random() * 2 - 1) * decay * decay
    }
    const src = ctx.createBufferSource()
    src.buffer = buffer

    const filter = ctx.createBiquadFilter()
    filter.type = 'lowpass'
    filter.frequency.value = 260 + Math.random() * 120

    const gain = ctx.createGain()
    gain.gain.value = 0.35 + Math.random() * 0.15
    gain.gain.exponentialRampToValueAtTime(0.001, now + dur)

    src.connect(filter)
    filter.connect(gain)
    gain.connect(footstepGainRef.current)
    src.start(now)
  }, [])

  // Special soft chime for milestones (final letter unlock)
  const playChime = useCallback(() => {
    const ctx = ensureContext()
    if (!ctx || mutedRef.current) return
    const now = ctx.currentTime
    const notes = [523.25, 659.25, 783.99, 1046.5]
    notes.forEach((freq, i) => {
      const osc = ctx.createOscillator()
      osc.type = 'sine'
      osc.frequency.value = freq
      const g = ctx.createGain()
      const start = now + i * 0.14
      g.gain.setValueAtTime(0, start)
      g.gain.linearRampToValueAtTime(0.12, start + 0.08)
      g.gain.exponentialRampToValueAtTime(0.001, start + 1.4)
      osc.connect(g)
      g.connect(masterGainRef.current || ctx.destination)
      osc.start(start)
      osc.stop(start + 1.5)
    })
  }, [ensureContext])

  const toggleMute = useCallback(() => {
    setMuted((m) => {
      const next = !m
      mutedRef.current = next
      if (masterGainRef.current && ctxRef.current) {
        masterGainRef.current.gain.linearRampToValueAtTime(
          next ? 0 : 0.45,
          ctxRef.current.currentTime + 0.4
        )
      }
      return next
    })
  }, [])

  const unlock = useCallback(() => {
    const ctx = ensureContext()
    if (ctx && ctx.state === 'suspended') ctx.resume()
    startAmbient()
  }, [ensureContext, startAmbient])

  useEffect(() => {
    return () => {
      stopAmbient()
      if (ctxRef.current) {
        try {
          ctxRef.current.close()
        } catch (e) {
          /* ignore */
        }
      }
    }
  }, [stopAmbient])

  return { unlock, playFootstep, playChime, toggleMute, muted, ready }
}
