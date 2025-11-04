"use client"

import { useThree } from '@react-three/fiber'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useEffect } from 'react'
import { shots } from '@/lib/cameraPath'

gsap.registerPlugin(ScrollTrigger)

// Orchestrates camera only within the #hero section
export default function HeroScrollOrchestrator() {
  const { camera } = useThree()

  useEffect(() => {
    const section = document.getElementById('hero')
    if (!section) return

    const startShot = shots[0]
    const endShot = shots[1] ?? shots[0]

    const state = {
      px: camera.position.x,
      py: camera.position.y,
      pz: camera.position.z,
      tx: 0,
      ty: 0,
      tz: 0,
    }

    const setCam = () => {
      camera.position.set(state.px, state.py, state.pz)
      camera.lookAt(state.tx, state.ty, state.tz)
      camera.updateProjectionMatrix()
    }

    // Initialize at the hero start position
    state.px = startShot.pos[0]
    state.py = startShot.pos[1]
    state.pz = startShot.pos[2]
    state.tx = startShot.target[0]
    state.ty = startShot.target[1]
    state.tz = startShot.target[2]
    setCam()

    const tween = gsap.to(state, {
      px: endShot.pos[0],
      py: endShot.pos[1],
      pz: endShot.pos[2],
      tx: endShot.target[0],
      ty: endShot.target[1],
      tz: endShot.target[2],
      ease: 'none',
      onUpdate: setCam,
      scrollTrigger: {
        trigger: section,
        start: 'top top',
        end: 'bottom top',
        scrub: true,
        pin: true,
        anticipatePin: 1,
      },
    })

    return () => {
      tween.kill()
    }
  }, [camera])

  return null
}

