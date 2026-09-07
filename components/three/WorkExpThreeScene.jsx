'use client'

import { useEffect, useRef } from 'react'
import * as THREE from 'three'

function makeSprite() {
  const c = document.createElement('canvas')
  c.width = c.height = 128
  const ctx = c.getContext('2d')
  const g = ctx.createRadialGradient(64, 64, 0, 64, 64, 64)
  g.addColorStop(0,   'rgba(255,255,255,1)')
  g.addColorStop(0.35,'rgba(255,255,255,0.7)')
  g.addColorStop(1,   'rgba(255,255,255,0)')
  ctx.fillStyle = g
  ctx.fillRect(0, 0, 128, 128)
  return new THREE.CanvasTexture(c)
}

export default function WorkExpThreeScene() {
  const mountRef = useRef(null)

  useEffect(() => {
    const mount = mountRef.current
    if (!mount) return

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    const N1 = 50 // tight drifters
    const N2 = 30 // bokeh background
    let W = mount.clientWidth
    let H = mount.clientHeight

    const renderer = new THREE.WebGLRenderer({ antialias: false, alpha: true })
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    renderer.setSize(W, H)
    renderer.domElement.style.cssText =
      'position:absolute;inset:0;width:100%;height:100%;pointer-events:none;'
    mount.appendChild(renderer.domElement)

    const scene  = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(55, W / H, 0.1, 200)
    camera.position.z = 9

    const tex = makeSprite()

    // Layer 1
    const p1 = new Float32Array(N1 * 3)
    const c1 = new Float32Array(N1 * 3)
    const spd1 = new Float32Array(N1)
    const off1 = new Float32Array(N1)
    for (let i = 0; i < N1; i++) {
      p1[i*3] = (Math.random() - 0.5) * 18
      p1[i*3+1] = (Math.random() - 0.5) * 11
      p1[i*3+2] = (Math.random() - 0.5) * 5
      c1[i*3] = c1[i*3+1] = c1[i*3+2] = 0.9 + Math.random() * 0.1
      spd1[i] = Math.random() * 0.3 + 0.08
      off1[i] = Math.random() * Math.PI * 2
    }
    const g1 = new THREE.BufferGeometry()
    g1.setAttribute('position', new THREE.BufferAttribute(p1, 3))
    g1.setAttribute('color',    new THREE.BufferAttribute(c1, 3))
    const m1 = new THREE.PointsMaterial({
      size: 0.06, map: tex, vertexColors: true,
      transparent: true, opacity: 0.6,
      depthWrite: false, blending: THREE.AdditiveBlending, sizeAttenuation: true,
    })
    scene.add(new THREE.Points(g1, m1))

    // Layer 2
    const p2 = new Float32Array(N2 * 3)
    const c2 = new Float32Array(N2 * 3)
    const spd2 = new Float32Array(N2)
    const off2 = new Float32Array(N2)
    for (let i = 0; i < N2; i++) {
      p2[i*3] = (Math.random() - 0.5) * 16
      p2[i*3+1] = (Math.random() - 0.5) * 10
      p2[i*3+2] = (Math.random() - 0.5) * 3 - 3
      c2[i*3] = c2[i*3+1] = c2[i*3+2] = 1
      spd2[i] = Math.random() * 0.12 + 0.03
      off2[i] = Math.random() * Math.PI * 2
    }
    const g2 = new THREE.BufferGeometry()
    g2.setAttribute('position', new THREE.BufferAttribute(p2, 3))
    g2.setAttribute('color',    new THREE.BufferAttribute(c2, 3))
    const m2 = new THREE.PointsMaterial({
      size: 0.5, map: tex, vertexColors: true,
      transparent: true, opacity: 0.1,
      depthWrite: false, blending: THREE.AdditiveBlending, sizeAttenuation: true,
    })
    scene.add(new THREE.Points(g2, m2))

    let raf
    let isVisible = false
    let pageVisible = !document.hidden
    const io = new IntersectionObserver(([e]) => {
      isVisible = e.isIntersecting
      if (isVisible) startLoop()
    }, { threshold: 0.05 })
    io.observe(mount)

    const onVis = () => { pageVisible = !document.hidden }
    document.addEventListener('visibilitychange', onVis)

    const timer = new THREE.Timer()
    timer.update(performance.now())

    function tick() {
      raf = requestAnimationFrame(tick)
      if (!isVisible || !pageVisible) return
      timer.update(performance.now())
      const dt = Math.min(timer.getDelta(), 0.05)
      const elapsed = timer.getElapsed()

      camera.rotation.y += 0.02 * dt

      for (let i = 0; i < N1; i++) {
        p1[i*3+1] += spd1[i] * dt * 0.6
        p1[i*3]   += Math.sin(elapsed * spd1[i] * 0.7 + off1[i]) * dt * 0.1
        if (p1[i*3+1] > 6) p1[i*3+1] = -6
      }
      g1.attributes.position.needsUpdate = true

      for (let i = 0; i < N2; i++) {
        p2[i*3+1] += spd2[i] * dt * 0.4
        p2[i*3]   += Math.sin(elapsed * spd2[i] * 0.5 + off2[i]) * dt * 0.07
        if (p2[i*3+1] > 6) p2[i*3+1] = -6
      }
      g2.attributes.position.needsUpdate = true

      renderer.render(scene, camera)
    }

    function startLoop() {
      cancelAnimationFrame(raf)
      tick()
    }

    const ro = new ResizeObserver(() => {
      W = mount.clientWidth; H = mount.clientHeight
      camera.aspect = W / H
      camera.updateProjectionMatrix()
      renderer.setSize(W, H)
    })
    ro.observe(mount)

    return () => {
      cancelAnimationFrame(raf)
      io.disconnect()
      ro.disconnect()
      document.removeEventListener('visibilitychange', onVis)
      g1.dispose(); g2.dispose()
      m1.dispose(); m2.dispose()
      tex.dispose()
      renderer.dispose()
      if (mount.contains(renderer.domElement)) mount.removeChild(renderer.domElement)
    }
  }, [])

  return (
    <div
      ref={mountRef}
      style={{ position: 'absolute', inset: 0, zIndex: 0, pointerEvents: 'none' }}
    />
  )
}
