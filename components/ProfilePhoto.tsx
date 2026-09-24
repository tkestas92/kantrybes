'use client'

import Image from 'next/image'
import { resolvePhotoUrl } from '@/lib/djbook'

type Props = {
  src: string
  alt: string
  className?: string
}

export default function ProfilePhoto({ src, alt, className }: Props) {
  const resolvedSrc = resolvePhotoUrl(src)

  return (
    <Image
      src={resolvedSrc}
      alt={alt}
      width={1200}
      height={800}
      className={className}
      onError={(e) => {
        e.currentTarget.style.display = 'none'
      }}
    />
  )
}
