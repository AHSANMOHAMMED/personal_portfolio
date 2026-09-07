'use client'

import { useEffect, useRef } from 'react'
import * as THREE from 'three'

export default function AboutThreeScene() {
  const mountRef = useRef(null)

  useEffect(() => {
    const mount = mountRef.current
    if (!mount) return

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    const COUNT = 50
    let W = mount.clientWidth
    let H = mount.clientHeight

    const renderer = new THREE.WebGLRenderer({ antialias: false, alpha: true })
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    renderer.setSize(W, H)
    renderer.domElement.style.cssText =
      'position:absolute;inset:0;width:100%;height:100%;pointer-events:none;'
    mount.appendChild(renderer.domElement)

    const scene  = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(50, W / H, 0.1, 100)
    camera.position.z = 8

    const meshes = []
    const COLORS = [0xc2a4ff, 0x8a6cc7]

    for (let i = 0; i < COUNT; i++) {
      const geo = new THREE.PlaneGeometry(0.4, 0.6)
      const mat = new THREE.MeshBasicMaterial({
        color: COLORS[i % 2],
        transparent: true,
        opacity: 0.04 + Math.random() * 0.04,
        side: THREE.DoubleSide,
      })
      const mesh = new THREE.Mesh(geo, mat)
      mesh.position.set(
        (Math.random() - 0.5) * 16,
        (Math.random() - 0.5) * 10,
        (Math.random() - 0.5) * 6,
      )
      mesh.rotation.set(
        Math.random() * Math.PI * 2,
        Math.random() * Math.PI * 2,
        Math.random() * Math.PI * 2,
      )
      mesh.userData = {
        rx: (Math.random() - 0.5) * 0.3,
        ry: (Math.random() - 0.5) * 0.3,
        vy: (Math.random() - 0.5) * 0.04,
      }
      scene.add(mesh)
      meshes.push(mesh)
    }

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
      meshes.forEach(m => {
        m.rotation.x += m.userData.rx * dt
        m.rotation.y += m.userData.ry * dt
        m.position.y += m.userData.vy * dt
        if (m.position.y > 6)  m.position.y = -6
        if (m.position.y < -6) m.position.y =  6
      })
      renderer.render(scene, camera)
    }

    function startLoop() {
      cancelAnimationFrame(raf)
      tick()
    }

    const ro = new ResizeObserver(() => {
      W = mount.clientWidth
      H = mount.clientHeight
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
      meshes.forEach(m => { m.geometry.dispose(); m.material.dispose() })
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
