import { ImageResponse } from 'next/og'

export const size = {
  width: 32,
  height: 32,
}
export const contentType = 'image/png'

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          background: 'linear-gradient(135deg, #8B5CF6, #D946EF)',
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          borderRadius: 8,
        }}
      >
        <span
          style={{
            color: 'white',
            fontWeight: 'bold',
            fontSize: 18,
          }}
        >
          n
        </span>
      </div>
    ),
    {
      ...size,
    }
  )
}
