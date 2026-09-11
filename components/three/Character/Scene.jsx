'use client'

import { useEffect, useRef } from 'react'
import * as THREE from 'three'
import setCharacter from './utils/character'
import setLighting from './utils/lighting'
import { useLoading } from '@/context/LoadingProvider'
import handleResize from './utils/resizeUtils'
import {
  handleMouseMove,
  handleTouchEnd,
  handleHeadRotation,
  handleTouchMove,
} from './utils/mouseUtils'
import setAnimations from './utils/animationUtils'

const Scene = () => {
  const canvasDiv = useRef(null)
  const hoverDivRef = useRef(null)
  const characterRef = useRef(null)
  const startTimelinesRef = useRef(null)
  const { setLoading, finishLoading, isLoading } = useLoading()

  useEffect(() => {
    if (isLoading) return
    if (!characterRef.current || !startTimelinesRef.current) return
    window.scrollTo(0, 0)
    requestAnimationFrame(() => {
      startTimelinesRef.current?.(characterRef.current)
    })
  }, [isLoading])

  const loadingApi = useRef({ setLoading, finishLoading })

  useEffect(() => {
    loadingApi.current = { setLoading, finishLoading }
  }, [setLoading, finishLoading])

  useEffect(() => {
    const container = canvasDiv.current
    if (!container) return

    let disposed = false
    container.querySelectorAll('canvas').forEach((c) => c.remove())

    const scene = new THREE.Scene()
    const rect = container.getBoundingClientRect()
    const width = Math.max(1, Math.round(rect.width || window.innerWidth * 0.64))
    const height = Math.max(1, Math.round(rect.height || window.innerHeight))
    const aspect = width / height || 16 / 9

    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: window.devicePixelRatio < 2,
      powerPreference: 'high-performance',
      preserveDrawingBuffer: true,
    })
    renderer.setClearColor(0x000000, 0)
    renderer.setSize(width, height)
    const isCompact = window.innerWidth <= 1024
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, isCompact ? 1.25 : 2))
    renderer.toneMapping = THREE.ACESFilmicToneMapping
    renderer.toneMappingExposure = 1.05
    renderer.domElement.style.position = 'absolute'
    renderer.domElement.style.inset = '0'
    renderer.domElement.style.width = '100%'
    renderer.domElement.style.height = '100%'
    renderer.domElement.style.pointerEvents = 'none'
    renderer.domElement.style.zIndex = '2'
    container.insertBefore(renderer.domElement, container.firstChild)

    const camera = new THREE.PerspectiveCamera(isCompact ? 16 : 14.5, aspect, 0.1, 1000)
    // Reference framing for full-width centered canvas (mesh stays mid-frame)
    camera.position.set(0, isCompact ? 12.4 : 13.2, isCompact ? 28 : 26.5)
    camera.zoom = 1.0
    camera.updateProjectionMatrix()

    scene.add(new THREE.AmbientLight(0xc2a4ff, 0.5))
    const key = new THREE.DirectionalLight(0xffffff, 0.9)
    key.position.set(2, 8, 6)
    scene.add(key)

    let headBone = null
    let screenLight = null
    let mixer = null
    let lastTime = performance.now()

    const light = setLighting(scene)
    const { loadCharacter, startScrollTimelines } = setCharacter()
    startTimelinesRef.current = (character) =>
      startScrollTimelines(character, camera)

    const isCurrentMount = () =>
      !disposed && renderer.domElement.parentNode === container

    loadCharacter()
      .then((gltf) => {
        if (!isCurrentMount() || !gltf) {
          if (isCurrentMount()) loadingApi.current.finishLoading?.()
          return
        }

        const animations = setAnimations(gltf)
        if (hoverDivRef.current) animations.hover(gltf, hoverDivRef.current)
        mixer = animations.mixer
        const character = gltf.scene
        characterRef.current = character
        scene.add(character)
        headBone = character.getObjectByName('spine006') || null
        screenLight = character.getObjectByName('screenlight') || null

        loadingApi.current.setLoading?.(100)
        loadingApi.current.finishLoading?.()
        light.turnOnLights()

        setTimeout(() => {
          if (!isCurrentMount()) return
          animations.startIntro()
          if (!document.querySelector('.loading-screen')) {
            window.scrollTo(0, 0)
            startScrollTimelines(character, camera)
          }
        }, 400)

        const onResize = () =>
          handleResize(renderer, camera, canvasDiv, character)
        window.addEventListener('resize', onResize)
        resizeHandler = onResize
      })
      .catch((err) => {
        console.error('Character load failed:', err)
        if (isCurrentMount()) loadingApi.current.finishLoading?.()
      })

    let mouse = { x: 0, y: 0 }
    let interpolation = { x: 0.1, y: 0.2 }
    let resizeHandler = null

    const onMouseMove = (event) => {
      handleMouseMove(event, (x, y) => {
        mouse = { x, y }
      })
    }
    let debounce
    const onTouchStart = (event) => {
      const element = event.target
      debounce = setTimeout(() => {
        element?.addEventListener('touchmove', (e) =>
          handleTouchMove(e, (x, y) => {
            mouse = { x, y }
          }),
        )
      }, 200)
    }
    const onTouchEnd = () => {
      handleTouchEnd((x, y, interpolationX, interpolationY) => {
        mouse = { x, y }
        interpolation = { x: interpolationX, y: interpolationY }
      })
    }

    document.addEventListener('mousemove', onMouseMove)
    const landingDiv = document.getElementById('landingDiv')
    if (landingDiv) {
      landingDiv.addEventListener('touchstart', onTouchStart)
      landingDiv.addEventListener('touchend', onTouchEnd)
    }

    const animate = (now) => {
      if (disposed) return
      const delta = Math.min((now - lastTime) / 1000, 0.1)
      lastTime = now
      if (headBone) {
        handleHeadRotation(
          headBone,
          mouse.x,
          mouse.y,
          interpolation.x,
          interpolation.y,
          THREE.MathUtils.lerp,
        )
        if (screenLight) light.setPointLight(screenLight)
      }
      if (mixer) mixer.update(delta)
      renderer.render(scene, camera)
    }
    renderer.setAnimationLoop(animate)

    return () => {
      disposed = true
      renderer.setAnimationLoop(null)
      clearTimeout(debounce)
      if (resizeHandler) window.removeEventListener('resize', resizeHandler)
      document.removeEventListener('mousemove', onMouseMove)
      if (landingDiv) {
        landingDiv.removeEventListener('touchstart', onTouchStart)
        landingDiv.removeEventListener('touchend', onTouchEnd)
      }
      renderer.dispose()
      renderer.domElement?.remove()
    }
  }, [])

  return (
    <div className="character-container">
      <div className="character-model" ref={canvasDiv}>
        <div className="character-rim" />
        <div className="character-hover" ref={hoverDivRef} />
      </div>
    </div>
  )
}

export default Scene
