import type { ReactNode } from 'react'

type Props = {
  children: ReactNode
  /** Fill through the footer bar's top margin so the column meets that bar. */
  connectFooter?: boolean
  /** Vertically center short pages, such as the landing hero. */
  center?: boolean
  /** Opaque column and edge lines. Landing leaves this off so the grid shows through. */
  solid?: boolean
}

export default function ContentColumn({ children, connectFooter = false, center = false, solid = true }: Props) {
  return (
    <div className="flex w-full flex-1 flex-col">
      <main
        className={[
          'relative mx-auto -mt-8 flex min-h-full w-full max-w-3xl flex-1 flex-col px-6 pt-8',
          solid ? 'border-x border-[#262626] bg-[var(--surface-solid)]' : '',
          connectFooter ? '-mb-16 pb-16' : '',
          center ? 'items-center justify-center' : '',
        ].join(' ')}
      >
        {children}
      </main>
    </div>
  )
}
