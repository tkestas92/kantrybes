import { ImageResponse } from 'next/og'

export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          background: '#0f0f0f',
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          fontFamily: 'sans-serif',
        }}
      >
        <div style={{ fontSize: 72, fontWeight: 500, color: '#f0f0f0', marginBottom: 12 }}>
          Dev Portfolio — Kęstas Trybė
        </div>
        <div style={{ fontSize: 28, color: '#888' }}>
          Full-stack developer · AI/ML engineer · DJ Kantrybės
        </div>
      </div>
    ),
    { ...size }
  )
}
