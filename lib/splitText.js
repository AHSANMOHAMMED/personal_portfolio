import { gsap } from '@/lib/gsap'

export function splitText(element, options = {}) {
  const {
    type = 'chars,words,lines',
    linesClass = 'split-line',
  } = options

  const chars = []
  const words = []
  const lines = []

  const originalHTML = element.innerHTML

  if (type.includes('chars') && type.includes('words')) {
    const html = element.innerHTML.split(/(<[^>]+>)/).map((part) => {
      if (part.startsWith('<')) return part
      return part.split(/(\s+)/).map((word) => {
        if (word.trim() === '') return word
        const charsHtml = word.split('').map((c) => {
          if (c === ' ') return ' <span class="split-char">&nbsp;</span>'
          return `<span class="split-char">${c}</span>`
        }).join('')
        return `<span class="split-word">${charsHtml}</span>`
      }).join('')
    }).join('')
    element.innerHTML = html
  } else if (type.includes('chars')) {
    const html = element.innerHTML.split('').map((c) => {
      if (c === ' ') return ' <span class="split-char">&nbsp;</span>'
      if (c === '\n') return '<br>'
      return `<span class="split-char">${c}</span>`
    }).join('')
    element.innerHTML = html
  } else if (type.includes('words')) {
    const html = element.innerHTML.split(/(\s+)/).map((w) => {
      if (w.trim() === '') return w
      return `<span class="split-word">${w}</span>`
    }).join('')
    element.innerHTML = html
  }

  if (type.includes('lines')) {
    requestAnimationFrame(() => {
      const allChars = element.querySelectorAll('.split-char, .split-word')
      let currentLine = []
      let lastTop = null
      const lineElements = []

      allChars.forEach((char) => {
        const top = char.getBoundingClientRect().top
        if (lastTop !== null && Math.abs(top - lastTop) > 5) {
          if (currentLine.length > 0) {
            const lineSpan = document.createElement('span')
            lineSpan.className = linesClass
            lineSpan.style.display = 'block'
            currentLine[0].parentNode.insertBefore(lineSpan, currentLine[0])
            currentLine.forEach((c) => lineSpan.appendChild(c))
            lineElements.push(lineSpan)
            currentLine = []
          }
        }
        currentLine.push(char)
        lastTop = top
      })

      if (currentLine.length > 0) {
        const lineSpan = document.createElement('span')
        lineSpan.className = linesClass
        lineSpan.style.display = 'block'
        currentLine[0].parentNode.insertBefore(lineSpan, currentLine[0])
        currentLine.forEach((c) => lineSpan.appendChild(c))
        lineElements.push(lineSpan)
      }

      lines.push(...lineElements)
      words.push(...element.querySelectorAll('.split-word'))
      chars.push(...element.querySelectorAll('.split-char'))
    })
  } else {
    chars.push(...element.querySelectorAll('.split-char'))
    words.push(...element.querySelectorAll('.split-word'))
  }

  return {
    chars,
    words,
    lines,
    originalHTML,
    revert() {
      element.innerHTML = originalHTML
    },
  }
}

export function animateSplitText(split, options = {}) {
  const { y = 80, autoAlpha = 0, duration = 1, stagger = 0.02, ease = 'power3.out', scrollTrigger, delay = 0 } = options

  const target = split.lines.length > 0 ? split.lines : split.words.length > 0 ? split.words : split.chars

  return gsap.fromTo(target,
    { y, autoAlpha },
    {
      y: 0,
      autoAlpha: 1,
      duration,
      stagger,
      ease,
      delay,
      scrollTrigger,
    }
  )
}