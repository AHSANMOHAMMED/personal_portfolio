// Simple text splitter utility to replace GSAP SplitText
export class TextSplitter {
  constructor(target, vars) {
    this.chars = []
    this.words = []
    this.lines = []
    this.elements = []
    this.originalHTML = new Map()

    const type = vars?.type || 'chars,words,lines'
    const linesClass = vars?.linesClass || 'split-line'

    let elements = []
    if (typeof target === 'string') {
      elements = Array.from(document.querySelectorAll(target))
    } else if (target instanceof NodeList) {
      elements = Array.from(target)
    } else if (Array.isArray(target)) {
      elements = target
    } else {
      elements = [target]
    }

    this.selector = typeof target === 'string' ? target : ''
    this.elements = elements

    elements.forEach((element) => {
      this.originalHTML.set(element, element.innerHTML)

      if (type.includes('chars') && type.includes('words')) {
        this.splitWords(element)
        this.splitCharsFromWords(element)
      } else if (type.includes('chars')) {
        this.splitChars(element)
      } else if (type.includes('words')) {
        this.splitWords(element)
      }

      if (type.includes('lines')) {
        this.splitLines(element, linesClass)
      }
    })
  }

  /** Split text nodes into char spans while preserving <br> and element wrappers. */
  splitChars(element) {
    const walk = (parent) => {
      const nodes = Array.from(parent.childNodes)
      nodes.forEach((node) => {
        if (node.nodeType === Node.TEXT_NODE) {
          const text = node.textContent || ''
          if (!text) {
            parent.removeChild(node)
            return
          }
          const frag = document.createDocumentFragment()
          for (const char of text) {
            if (char === '\n') {
              frag.appendChild(document.createElement('br'))
              continue
            }
            const span = document.createElement('span')
            span.className = 'split-char'
            span.textContent = char
            frag.appendChild(span)
            this.chars.push(span)
          }
          parent.replaceChild(frag, node)
          return
        }

        if (node.nodeType !== Node.ELEMENT_NODE) return
        if (node.nodeName === 'BR') return
        if (node.classList?.contains('split-char')) return
        walk(node)
      })
    }

    walk(element)
  }

  splitWords(element) {
    const text = element.textContent || ''
    const words = text.split(/(\s+)/)

    element.innerHTML = words
      .map((word) => {
        if (word.trim().length === 0) {
          return word
        }
        return `<span class="split-word">${word}</span>`
      })
      .join('')

    this.words.push(...Array.from(element.querySelectorAll('.split-word')))
  }

  splitCharsFromWords(element) {
    const words = element.querySelectorAll('.split-word')
    words.forEach((word) => {
      const text = word.textContent || ''
      const chars = text.split('')
      word.innerHTML = chars
        .map((char) => `<span class="split-char">${char}</span>`)
        .join('')
      this.chars.push(...Array.from(word.querySelectorAll('.split-char')))
    })
  }

  splitLines(element, linesClass) {
    requestAnimationFrame(() => {
      const items = element.querySelectorAll('.split-word, .split-char')
      if (items.length === 0) return

      let currentLine = []
      let lines = []
      let currentTop = 0

      items.forEach((item) => {
        const rect = item.getBoundingClientRect()
        if (currentLine.length === 0) {
          currentTop = rect.top
          currentLine = [item]
          return
        }

        if (Math.abs(rect.top - currentTop) > 5) {
          lines.push([...currentLine])
          currentLine = [item]
          currentTop = rect.top
        } else {
          currentLine.push(item)
        }
      })

      if (currentLine.length > 0) {
        lines.push(currentLine)
      }

      lines.forEach((line) => {
        if (line.length === 0) return
        const lineWrapper = document.createElement('span')
        lineWrapper.className = linesClass
        lineWrapper.style.display = 'block'
        const firstItem = line[0]
        firstItem.parentNode?.insertBefore(lineWrapper, firstItem)
        line.forEach((item) => {
          if (item.parentNode === lineWrapper.parentNode) {
            lineWrapper.appendChild(item)
          }
        })
      })

      this.lines.push(...Array.from(element.querySelectorAll(`.${linesClass}`)))
    })
  }

  revert() {
    this.elements.forEach((element) => {
      const original = this.originalHTML.get(element)
      if (original !== undefined) {
        element.innerHTML = original
      }
    })
    this.chars = []
    this.words = []
    this.lines = []
    this.originalHTML.clear()
  }
}
