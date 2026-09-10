import * as THREE from 'three'
import { RGBELoader } from 'three-stdlib'
import { gsap } from '@/lib/gsap'
import { assetUrl } from '@/lib/siteConfig'

const setLighting = (scene) => {
  const directionalLight = new THREE.DirectionalLight(0xc7a9ff, 0)
  directionalLight.intensity = 0
  directionalLight.position.set(-0.47, -0.32, -1)
  scene.add(directionalLight)

  const pointLight = new THREE.PointLight(0xc2a4ff, 0, 100, 3)
  pointLight.position.set(3, 12, 4)
  scene.add(pointLight)

  new RGBELoader()
    .setPath(assetUrl('/models/'))
    .load('char_enviorment.hdr', function (texture) {
      texture.mapping = THREE.EquirectangularReflectionMapping
      scene.environment = texture
      scene.environmentIntensity = 0
      scene.environmentRotation.set(5.76, 85.85, 1)
    })

  function setPointLight(screenLight) {
    if (!screenLight?.material) return
    if (screenLight.material.opacity > 0.9) {
      pointLight.intensity = screenLight.material.emissiveIntensity * 20
    } else {
      pointLight.intensity = 0
    }
  }

  function turnOnLights() {
    directionalLight.intensity = Math.max(directionalLight.intensity, 0.45)
    scene.environmentIntensity = Math.max(scene.environmentIntensity || 0, 0.35)
    gsap.to(scene, {
      environmentIntensity: 0.64,
      duration: 2,
      ease: 'power2.inOut',
    })
    gsap.to(directionalLight, {
      intensity: 1,
      duration: 2,
      ease: 'power2.inOut',
    })
    const rim = document.querySelector('.character-rim')
    if (rim) {
      gsap.to(rim, {
        y: '55%',
        opacity: 1,
        delay: 0.2,
        duration: 2,
      })
    }
  }

  return { setPointLight, turnOnLights }
}

export default setLighting
