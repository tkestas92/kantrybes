'use client'

import { resolvePhotoUrl } from '@/lib/djbook'

type Props = {
  src: string
  alt: string
  className?: string
}

export default function ProfilePhoto({ src, alt, className }: Props) {
  const resolvedSrc = resolvePhotoUrl(src)

  return (
    /* eslint-disable-next-line @next/next/no-img-element */
    <img
      src={resolvedSrc}
      alt={alt}
      className={className}
      onError={(e) => {
        e.currentTarget.style.display = 'none'
      }}
    />
  )
}
