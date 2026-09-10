import * as THREE from 'three'
import { eyebrowBoneNames, typingBoneNames } from '@/data/boneData'

const setAnimations = (gltf) => {
  const character = gltf.scene
  const mixer = new THREE.AnimationMixer(character)
  const clips = gltf.animations || []

  if (clips.length) {
    const introClip = clips.find((clip) => clip.name === 'introAnimation')
    if (introClip) {
      const introAction = mixer.clipAction(introClip)
      introAction.setLoop(THREE.LoopOnce, 1)
      introAction.clampWhenFinished = true
      introAction.play()
    }

    ;['key1', 'key2', 'key5', 'key6'].forEach((name) => {
      const clip = THREE.AnimationClip.findByName(clips, name)
      if (!clip) return
      const action = mixer.clipAction(clip)
      action.play()
      action.timeScale = 1.2
    })

    const typingAction = createBoneAction(gltf, mixer, 'typing', typingBoneNames)
    if (typingAction) {
      typingAction.enabled = true
      typingAction.play()
      typingAction.timeScale = 1.2
    }
  }

  function startIntro() {
    const introClip = clips.find((clip) => clip.name === 'introAnimation')
    if (!introClip) return
    const introAction = mixer.clipAction(introClip)
    introAction.clampWhenFinished = true
    introAction.reset().play()
    setTimeout(() => {
      const blink = clips.find((clip) => clip.name === 'Blink')
      if (blink) mixer.clipAction(blink).play().fadeIn(0.5)
    }, 2500)
  }

  function hover(gltfInner, hoverDiv) {
    const eyeBrowUpAction = createBoneAction(
      gltfInner,
      mixer,
      'browup',
      eyebrowBoneNames,
    )
    let isHovering = false
    if (eyeBrowUpAction) {
      eyeBrowUpAction.setLoop(THREE.LoopOnce, 1)
      eyeBrowUpAction.clampWhenFinished = true
      eyeBrowUpAction.enabled = true
    }
    const onHoverFace = () => {
      if (eyeBrowUpAction && !isHovering) {
        isHovering = true
        eyeBrowUpAction.reset()
        eyeBrowUpAction.enabled = true
        eyeBrowUpAction.setEffectiveWeight(4)
        eyeBrowUpAction.fadeIn(0.5).play()
      }
    }
    const onLeaveFace = () => {
      if (eyeBrowUpAction && isHovering) {
        isHovering = false
        eyeBrowUpAction.fadeOut(0.6)
      }
    }
    if (!hoverDiv) return
    hoverDiv.addEventListener('mouseenter', onHoverFace)
    hoverDiv.addEventListener('mouseleave', onLeaveFace)
    return () => {
      hoverDiv.removeEventListener('mouseenter', onHoverFace)
      hoverDiv.removeEventListener('mouseleave', onLeaveFace)
    }
  }

  return { mixer, startIntro, hover }
}

const createBoneAction = (gltf, mixer, clip, boneNames) => {
  const animationClip = THREE.AnimationClip.findByName(gltf.animations, clip)
  if (!animationClip) return null
  const filteredClip = filterAnimationTracks(animationClip, boneNames)
  return mixer.clipAction(filteredClip)
}

const filterAnimationTracks = (clip, boneNames) => {
  const filteredTracks = clip.tracks.filter((track) =>
    boneNames.some((boneName) => track.name.includes(boneName)),
  )
  return new THREE.AnimationClip(
    clip.name + '_filtered',
    clip.duration,
    filteredTracks,
  )
}

export default setAnimations
