import * as THREE from 'three'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { setCharTimeline, setAllTimeline } from '@/lib/GsapScroll'
import { decryptFile } from './decrypt'
import { assetUrl } from '@/lib/siteConfig'

function prepareCharacter(gltf) {
  const character = gltf.scene
  character.traverse((child) => {
    if (!child.isMesh) return
    child.castShadow = false
    child.receiveShadow = false
    child.frustumCulled = false
    const mats = Array.isArray(child.material) ? child.material : [child.material]
    mats.forEach((mat) => {
      if (!mat) return
      mat.needsUpdate = true
    })
  })
  const footR = character.getObjectByName('footR')
  const footL = character.getObjectByName('footL')
  if (footR) footR.position.y = 3.36
  if (footL) footL.position.y = 3.36
  return gltf
}

const setCharacter = () => {
  const loader = new GLTFLoader()

  const loadFromUrl = (url) =>
    new Promise((resolve, reject) => {
      loader.load(url, (gltf) => resolve(prepareCharacter(gltf)), undefined, reject)
    })

  const loadCharacter = async () => {
    // Plain GLB first (same model, avoids concurrent decrypt races in Strict Mode)
    try {
      return await loadFromUrl(assetUrl('/models/character.glb'))
    } catch (glbErr) {
      console.warn('GLB load failed, trying encrypted model', glbErr)
      const encryptedBlob = await decryptFile(
        assetUrl('/models/character.enc'),
        'Character3D#@',
      )
      const blobUrl = URL.createObjectURL(new Blob([encryptedBlob]))
      try {
        return await loadFromUrl(blobUrl)
      } finally {
        URL.revokeObjectURL(blobUrl)
      }
    }
  }

  return {
    loadCharacter,
    startScrollTimelines: (character, camera) => {
      if (!character || !camera) return
      setCharTimeline(character, camera)
      setAllTimeline()
    },
  }
}

export default setCharacter
