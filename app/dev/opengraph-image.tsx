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
          padding: 88,
        }}
      >
        <div style={{ display: 'flex', fontSize: 148, fontWeight: 600, letterSpacing: -1, gap: 22 }}>
          <span style={{ color: '#ffffff' }}>Kęstas</span>
          <span style={{ color: '#4afa8a' }}>Trybė</span>
        </div>
        <div style={{ display: 'flex', marginTop: 36, fontSize: 60, color: '#ffffff' }}>
          Full-stack · AI/ML · Mobile
        </div>
      </div>
    ),
    { ...size }
  )
}
