import type { ReactNode } from 'react'

type Props = {
  children: ReactNode
  /** Fill through the footer bar's top margin so the column meets that bar. */
  connectFooter?: boolean
  /** Vertically center short pages, such as the landing hero. */
  center?: boolean
}

export default function ContentColumn({ children, connectFooter = false, center = false }: Props) {
  return (
    <div className="flex w-full flex-1 flex-col">
      <main
        className={[
          'relative mx-auto -mt-8 flex min-h-full w-full max-w-3xl flex-1 flex-col border-x border-[#262626] bg-[var(--surface-solid)] px-6 pt-8',
          connectFooter ? '-mb-16 pb-16' : '',
          center ? 'items-center justify-center' : '',
        ].join(' ')}
      >
        {children}
      </main>
    </div>
  )
}
