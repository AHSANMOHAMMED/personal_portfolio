'use client'

import Link from 'next/link'
import { MdArrowOutward } from 'react-icons/md'
import { assetUrl } from '@/lib/siteConfig'

export default function WorkImage({ image, alt, link }) {
  const isExternalLink = Boolean(link && !link.startsWith('/'))
  const src = assetUrl(image)

  const content = (
    <>
      <div className="work-link">
        <MdArrowOutward />
      </div>
      <img src={src} alt={alt} loading="lazy" decoding="async" />
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
        <img src={src} alt={alt} loading="lazy" decoding="async" />
      </div>
    </div>
  )
}
