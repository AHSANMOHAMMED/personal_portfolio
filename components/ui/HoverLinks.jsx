'use client'

export default function HoverLinks({ text, cursor }) {
  return (
    <div className="hover-link" data-cursor={!cursor ? 'disable' : undefined}>
      <div className="hover-in">
        {text} <div>{text}</div>
      </div>
    </div>
  )
}
