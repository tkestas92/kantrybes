import { ImageResponse } from 'next/og'

export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          background: '#0a0a0a',
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          fontFamily: 'sans-serif',
          position: 'relative',
        }}
      >
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            background: 'radial-gradient(circle at 30% 20%, rgba(74,250,138,0.08), transparent 50%)',
            display: 'flex',
          }}
        />
        <div
          style={{
            position: 'absolute',
            top: 56,
            left: 64,
            display: 'flex',
            alignItems: 'center',
            gap: 10,
          }}
        >
          <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#4afa8a', display: 'flex' }} />
          <span style={{ fontSize: 20, color: '#666', letterSpacing: 3, fontWeight: 500 }}>KANTRYBES.LT</span>
        </div>
        <div
          style={{
            position: 'absolute',
            top: 48,
            right: 64,
            fontSize: 18,
            color: '#4afa8a',
            border: '1px solid rgba(74,250,138,0.3)',
            borderRadius: 20,
            padding: '8px 20px',
            display: 'flex',
          }}
        >
          Full-stack · AI/ML
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 24 }}>
          <div style={{ fontSize: 88, fontWeight: 500, color: '#f0f0f0', letterSpacing: -1, display: 'flex', gap: 16 }}>
            <span>Kęstas</span>
            <span style={{ color: '#4afa8a' }}>Trybė</span>
          </div>
          <div style={{ fontSize: 30, color: '#888', fontWeight: 400, letterSpacing: 0.5, display: 'flex' }}>
            Full-stack developer &amp; AI/ML engineer
          </div>
        </div>
      </div>
    ),
    { ...size }
  )
}
