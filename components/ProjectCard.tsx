import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { Github, Globe, Smartphone, ZoomIn } from 'lucide-react'
import type { Project } from '@/lib/db'
import { useLang } from '@/components/LangProvider'
import { t, type Lang } from '@/lib/translations'
import { resolveLiveDemoType, type LiveDemoType } from '@/lib/liveDemo'
import PhoneMockup from '@/components/PhoneMockup'
import BrowserMockup from '@/components/BrowserMockup'
import ImageLightbox from '@/components/ImageLightbox'
import { cld } from '@/lib/cloudinary'
import { CARD_TAG_LIMIT, normalizeTags, tagClass } from '@/lib/tags'

type Props = {
  project: Project
  labels: {
    statusInProgress: string
    statusShipped: string
    statusArchived: string
    github: string
    liveDemo: (typeof t)['lt']['liveDemo']
  }
  onLiveClick?: (url: string, title: string, type: LiveDemoType) => void
}

const GRID_BG = {
  backgroundColor: '#0f0f0f',
  backgroundImage:
    'linear-gradient(#1f1f1f 1px, transparent 1px), linear-gradient(90deg, #1f1f1f 1px, transparent 1px)',
  backgroundSize: '16px 16px',
} as const

function demoAnchorProps(url: string): { target?: string; rel?: string } {
  if (url.startsWith('/') && !url.startsWith('//')) return {}
  try {
    const host = new URL(url).hostname.replace(/^www\./, '')
    if (host === 'kantrybes.lt' || host === 'localhost') return {}
  } catch {
    return { target: '_blank', rel: 'noopener noreferrer' }
  }
  return { target: '_blank', rel: 'noopener noreferrer' }
}

function localizedText(project: Project, lang: Lang) {
  if (lang !== 'en') return { title: project.title, description: project.description }
  return {
    title: project.title_en?.trim() || project.title,
    description: project.description_en?.trim() || project.description,
  }
}

function descriptionHeights(el: HTMLElement) {
  const width = el.getBoundingClientRect().width
  const clone = el.cloneNode(true) as HTMLElement
  clone.style.cssText = `position:absolute;visibility:hidden;pointer-events:none;width:${width}px;height:auto;max-height:none;overflow:visible;display:block;-webkit-line-clamp:unset;`
  clone.className = el.className.replace(/\bline-clamp-3\b/, '').trim()
  document.body.appendChild(clone)
  const full = clone.offsetHeight
  clone.style.display = '-webkit-box'
  clone.style.webkitBoxOrient = 'vertical'
  clone.style.webkitLineClamp = '3'
  clone.style.overflow = 'hidden'
  const clamped = clone.offsetHeight
  clone.remove()
  return { full, clamped }
}

function rowSiblings(card: HTMLElement) {
  const grid = card.parentElement
  if (!grid) return []
  const cards = [...grid.children] as HTMLElement[]
  const cols = window.matchMedia('(min-width: 640px)').matches ? 2 : 1
  const index = cards.indexOf(card)
  if (index < 0) return []
  const start = Math.floor(index / cols) * cols
  return cards.slice(start, start + cols).filter((item) => item !== card)
}

export default function ProjectCard({ project, labels, onLiveClick }: Props) {
  const { lang } = useLang()
  const text = localizedText(project, lang)
  const liveType = resolveLiveDemoType(project)
  const liveLabel = liveType
    ? liveType === 'app'
      ? labels.liveDemo.appButton
      : labels.liveDemo.webButton
    : 'Live'
  const LiveIcon = liveType === 'app' ? Smartphone : Globe

  const tags = normalizeTags(project.tags).slice(0, CARD_TAG_LIMIT)
  const [zoom, setZoom] = useState(false)
  const [open, setOpen] = useState(false)
  const [needsMore, setNeedsMore] = useState(false)
  const [maxHeight, setMaxHeight] = useState<number | undefined>(undefined)
  const cardRef = useRef<HTMLDivElement>(null)
  const descRef = useRef<HTMLParagraphElement>(null)
  const heightsRef = useRef({ full: 0, clamped: 0 })
  const thumb = cld(project.image_url, 'f_auto,q_auto,w_900')
  const full = cld(project.image_url, 'f_auto,q_auto,w_1800')

  useLayoutEffect(() => {
    setOpen(false)
    setMaxHeight(undefined)
    const el = descRef.current
    if (!el) return
    const measure = () => {
      const next = descriptionHeights(el)
      heightsRef.current = next
      setNeedsMore(next.full > next.clamped + 1)
    }
    measure()
    const observer = new ResizeObserver(measure)
    observer.observe(el.parentElement ?? el)
    return () => {
      observer.disconnect()
      const card = cardRef.current
      if (!card) return
      rowSiblings(card).forEach((sibling) => {
        sibling.style.height = ''
        sibling.style.alignSelf = ''
      })
    }
  }, [text.description])

  useEffect(() => {
    const onResize = () => {
      const grid = cardRef.current?.parentElement
      if (!grid) return
      ;[...grid.children].forEach((node) => {
        const sibling = node as HTMLElement
        sibling.style.height = ''
        sibling.style.alignSelf = ''
      })
    }
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [])

  function lockSiblings(lock: boolean) {
    const card = cardRef.current
    if (!card) return
    rowSiblings(card).forEach((sibling) => {
      if (sibling.dataset.expanded === 'true') return
      if (lock) {
        sibling.style.height = `${sibling.getBoundingClientRect().height}px`
        sibling.style.alignSelf = 'start'
      } else {
        sibling.style.height = ''
        sibling.style.alignSelf = ''
      }
    })
  }

  function toggleDescription() {
    const { full: fullHeight, clamped } = heightsRef.current
    if (!open) {
      lockSiblings(true)
      setMaxHeight(clamped)
      setOpen(true)
      requestAnimationFrame(() => {
        requestAnimationFrame(() => setMaxHeight(fullHeight))
      })
      return
    }
    setMaxHeight(clamped)
    window.setTimeout(() => {
      setOpen(false)
      setMaxHeight(undefined)
      lockSiblings(false)
    }, 300)
  }

  return (
    <>
    <div
      ref={cardRef}
      data-expanded={open ? 'true' : 'false'}
      className="flex h-full flex-col gap-4 rounded-xl border border-[#252525] bg-[#161616] p-5 transition-[background-color,border-color] duration-200 hover:border-[#333] hover:bg-[#1e1e1e]"
    >
      <div className="flex shrink-0 justify-end">
        <span
          className={`text-xs px-2.5 py-1 rounded-full font-medium ${
            project.status === 'in_progress'
              ? 'bg-amber-950 text-amber-400'
              : 'bg-green-950 text-green-400'
          }`}
        >
          {project.status === 'in_progress'
            ? labels.statusInProgress
            : project.status === 'archived'
              ? labels.statusArchived
              : labels.statusShipped}
        </span>
      </div>
      {project.image_url && (
        <div
          className={`relative aspect-[4/3] w-full shrink-0 cursor-zoom-in overflow-hidden rounded-lg border border-[#1e1e1e] group/media ${project.platform ? '' : 'bg-[#0d0d0d]'}`}
          style={project.platform ? GRID_BG : undefined}
          role="button"
          tabIndex={0}
          aria-label={t[lang].dev.viewPhoto.replace('{title}', text.title)}
          onClick={() => setZoom(true)}
          onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setZoom(true) } }}
        >
          {project.platform === 'app' ? (
            <PhoneMockup src={thumb} alt={text.title} />
          ) : project.platform === 'web' ? (
            <BrowserMockup src={thumb} alt={text.title} />
          ) : (
            <img src={thumb} alt={text.title} className="w-full h-full object-contain" />
          )}
          <span className="surface-solid pointer-events-none absolute bottom-2 right-2 rounded-md p-1.5 text-white opacity-0 transition-opacity group-hover/media:opacity-100">
            <ZoomIn size={14} />
          </span>
        </div>
      )}

      <div>
        <h3 className="mb-1.5 text-[15px] font-medium text-white">{text.title}</h3>
        <p
          ref={descRef}
          style={open ? { maxHeight } : undefined}
          className={`overflow-hidden text-[13px] leading-relaxed text-white transition-[max-height] duration-300 ease-out ${open ? '' : 'line-clamp-3'}`}
        >
          {text.description}
        </p>
        {needsMore && (
          <button
            type="button"
            onClick={toggleDescription}
            aria-expanded={open}
            className="mt-1 text-[12px] text-white/70 transition-colors hover:text-white"
          >
            {open ? t[lang].dev.less : t[lang].dev.more}
          </button>
        )}
      </div>

      <div className="mt-auto flex flex-col gap-4">
      <div className="flex flex-wrap gap-1.5">
        {tags.map((tag) => (
          <span
            key={tag}
            className={`text-[11px] px-2 py-0.5 rounded font-medium ${tagClass(tag)}`}
          >
            {tag}
          </span>
        ))}
      </div>

      <div className="flex flex-wrap gap-2">
        {project.github_url && (
          <a
            href={project.github_url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 text-[12px] text-white border border-[#2a2a2a] rounded-md px-3 py-1.5 hover:text-white hover:border-[#444] transition-all"
          >
            <Github size={13} /> {labels.github}
          </a>
        )}
        {project.live_url && liveType && (
          onLiveClick ? (
            <button
              type="button"
              onClick={() => onLiveClick(project.live_url!, text.title, liveType)}
              className="flex items-center gap-1.5 text-[12px] text-white border border-[#2a2a2a] rounded-md px-3 py-1.5 hover:text-white hover:border-[#444] transition-all"
            >
              <LiveIcon size={13} /> {liveLabel}
            </button>
          ) : (
            <a
              href={project.live_url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 text-[12px] text-white border border-[#2a2a2a] rounded-md px-3 py-1.5 hover:text-white hover:border-[#444] transition-all"
            >
              <LiveIcon size={13} /> {liveLabel}
            </a>
          )
        )}
        {project.demo_url?.trim() && (
          <a
            href={project.demo_url}
            {...demoAnchorProps(project.demo_url)}
            className="flex items-center gap-1.5 text-[12px] text-white border border-[#2a2a2a] rounded-md px-3 py-1.5 hover:text-white hover:border-[#444] transition-all"
          >
            {labels.liveDemo.publicProfile}
          </a>
        )}
      </div>
      </div>
    </div>
    {zoom && project.image_url && (
      <ImageLightbox src={full} alt={text.title} onClose={() => setZoom(false)} />
    )}
    </>
  )
}
