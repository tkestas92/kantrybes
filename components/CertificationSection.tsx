'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import { FileText, X } from 'lucide-react'

type CertItem = {
  title: string
  subtitle: string
  tag: string
  alt: string
}

type CertWithMeta = CertItem & (typeof CERT_META)[number]

type Props = {
  labels: {
    section: string
    button: string
    close: string
    items: readonly CertItem[]
  }
}

const CERT_META = [
  {
    icon: '🤖',
    tagClassName: 'text-[#4afa8a] border-[#4afa8a]/30',
    image: '/certificates/codeacademy-ai-python.png',
    width: 723,
    height: 1024,
  },
  {
    icon: '🧪',
    tagClassName: 'text-blue-400 border-blue-400/30',
    image: '/certificates/vilnius-coding-manual-testing.png',
    width: 1024,
    height: 723,
  },
] as const

function CertificateModal({
  cert,
  closeLabel,
  onClose,
}: {
  cert: CertWithMeta
  closeLabel: string
  onClose: () => void
}) {
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    document.body.style.overflow = 'hidden'
    window.addEventListener('keydown', onKeyDown)
    return () => {
      document.body.style.overflow = ''
      window.removeEventListener('keydown', onKeyDown)
    }
  }, [onClose])

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6"
      role="dialog"
      aria-modal="true"
      aria-label={cert.title}
    >
      <button
        type="button"
        className="absolute inset-0 bg-black/80"
        onClick={onClose}
        aria-label={closeLabel}
      />
      <div className="relative z-10 w-full max-w-2xl max-h-[90vh] overflow-auto rounded-xl border border-[#333] bg-[#161616]">
        <div className="sticky top-0 flex items-center justify-between gap-3 border-b border-[#252525] bg-[#161616] px-4 py-3">
          <p className="text-[13px] font-medium text-white truncate">{cert.title}</p>
          <button
            type="button"
            onClick={onClose}
            className="text-gray-500 hover:text-white transition-colors"
            aria-label={closeLabel}
          >
            <X size={18} />
          </button>
        </div>
        <Image src={cert.image} alt={cert.alt} width={cert.width} height={cert.height} className="w-full h-auto" />
      </div>
    </div>
  )
}

export default function CertificationSection({ labels }: Props) {
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  const certificates = labels.items.map((item, index) => ({
    ...item,
    ...CERT_META[index],
  }))

  return (
    <>
      <section className="mt-10">
        <div className="flex items-center gap-3 mb-5">
          <span className="text-xs text-gray-600 uppercase tracking-widest">{labels.section}</span>
          <div className="flex-1 h-px bg-[#1e1e1e]" />
        </div>
        <div className="flex flex-col gap-3">
          {certificates.map((cert, index) => (
            <div
              key={cert.image}
              className="bg-[#161616] border border-[#252525] rounded-xl px-5 py-4 flex items-center gap-4 hover:border-[#333] transition-all"
            >
              <div className="text-2xl">{cert.icon}</div>
              <div className="flex-1 min-w-0">
                <p className="text-[14px] font-medium text-white">{cert.title}</p>
                <p className="text-[12px] text-gray-500 mt-0.5">{cert.subtitle}</p>
              </div>
              <div className="flex flex-col items-end gap-2 shrink-0">
                <span className={`text-[10px] border rounded-full px-2.5 py-1 ${cert.tagClassName}`}>{cert.tag}</span>
                <button
                  type="button"
                  onClick={() => setOpenIndex(index)}
                  className="flex items-center gap-1.5 text-[12px] text-gray-400 border border-[#2a2a2a] rounded-lg px-3 py-1.5 hover:text-[#4afa8a] hover:border-[#4afa8a] hover:bg-[#0e2a1a] transition-all"
                >
                  <FileText size={13} />
                  {labels.button}
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {openIndex !== null && (
        <CertificateModal
          cert={certificates[openIndex]}
          closeLabel={labels.close}
          onClose={() => setOpenIndex(null)}
        />
      )}
    </>
  )
}
