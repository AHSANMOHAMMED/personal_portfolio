'use client'

import { useState } from 'react'
import Link from 'next/link'
import { MdArrowOutward } from 'react-icons/md'

export default function WorkImage({ image, alt, link }) {
  const [isVideo, setIsVideo] = useState(false)
  const isExternalLink = Boolean(link && !link.startsWith('/'))

  const content = (
    <>
      <div className="work-link">
        <MdArrowOutward />
      </div>
      <img src={image?.startsWith('/') ? image : `/${image}`} alt={alt} loading="lazy" decoding="async" />
      {isVideo ? null : null}
    </>
  )

  if (link) {
    if (isExternalLink) {
      return (
        <div className="work-image">
          <a
            className="work-image-in"
            href={link}
            target="_blank"
            rel="noopener noreferrer"
            data-cursor="disable"
          >
            {content}
          </a>
        </div>
      )
    }
    return (
      <div className="work-image">
        <Link className="work-image-in" href={link} data-cursor="disable">
          {content}
        </Link>
      </div>
    )
  }

  return (
    <div className="work-image">
      <div className="work-image-in" data-cursor="disable">
        <img src={image?.startsWith('/') ? image : `/${image}`} alt={alt} loading="lazy" decoding="async" />
      </div>
    </div>
  )
}
