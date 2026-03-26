import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import QRCode from 'qrcode'
import api from '../services/api'

interface CardData {
  id: string
  balance: number
  program: {
    name: string
    type: string
    color: string
    emoji: string
    config: { total?: number; reward?: string }
    business: { name: string }
  }
  customer: {
    email: string
  }
}

export default function CardView() {
  const { cardId } = useParams()
  const [card, setCard] = useState<CardData | null>(null)
  const [qrUrl, setQrUrl] = useState('')
  const [error, setError] = useState('')

  useEffect(() => {
    loadCard()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const loadCard = async () => {
    try {
      const res = await api.get(`/cards/${cardId}`)
      setCard(res.data.card)
      const url = await QRCode.toDataURL(cardId!, {
        width: 200,
        margin: 2,
        color: { dark: '#0f2d52', light: '#ffffff' }
      })
      setQrUrl(url)
    } catch {
      setError('Carte introuvable')
    }
  }

  if (error) {
    return (
      <div style={{ minHeight: '100vh', background: '#f0f4f8', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ background: 'white', padding: '2rem', borderRadius: '12px', textAlign: 'center' }}>
          <div style={{ fontSize: '48px', marginBottom: '1rem' }}>❌</div>
          <div style={{ fontSize: '14px', color: '#64748b' }}>Carte introuvable</div>
        </div>
      </div>
    )
  }

  if (!card) {
    return (
      <div style={{ minHeight: '100vh', background: '#f0f4f8', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ fontSize: '14px', color: '#64748b' }}>Chargement...</div>
      </div>
    )
  }

  const total = card.program.config.total || 9
  const reward = card.program.config.reward || ''
  const color = card.program.color || '#1a1035'
  const emoji = card.program.emoji || '⭐'

  return (
    <div style={{ minHeight: '100vh', background: '#f0f4f8', display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '2rem 1rem' }}>

      {/* Carte wallet */}
      <div style={{ background: color, borderRadius: '20px', padding: '24px', width: '100%', maxWidth: '340px', color: 'white', position: 'relative', overflow: 'hidden', marginBottom: '1.5rem' }}>
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, fontSize: '28px', lineHeight: '1.4', opacity: .07, wordBreak: 'break-all', padding: '8px', pointerEvents: 'none' }}>
          {emoji.repeat(50)}
        </div>
        <div style={{ position: 'relative', zIndex: 1 }}>
          <div style={{ fontSize: '11px', opacity: .6, letterSpacing: '.1em', textTransform: 'uppercase', marginBottom: '4px' }}>{card.program.business.name}</div>
          <div style={{ fontSize: '18px', fontWeight: '500', marginBottom: '20px' }}>{card.program.name}</div>

          {card.program.type === 'STAMP' ? (
            <div style={{ display: 'grid', gridTemplateColumns: `repeat(${Math.min(total, 5)}, 1fr)`, gap: '8px', marginBottom: '16px' }}>
              {Array.from({ length: total }).map((_, i) => (
                <div key={i} style={{ aspectRatio: '1', borderRadius: '50%', background: i < card.balance ? 'rgba(255,255,255,0.3)' : 'rgba(255,255,255,0.08)', border: i < card.balance ? 'none' : '1.5px dashed rgba(255,255,255,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '14px' }}>
                  {i === total - 1 ? '🎁' : i < card.balance ? emoji : ''}
                </div>
              ))}
            </div>
          ) : (
            <div style={{ marginBottom: '16px' }}>
              <div style={{ fontSize: '32px', fontWeight: '600', letterSpacing: '-1px' }}>{card.balance}</div>
              <div style={{ fontSize: '11px', opacity: .5 }}>points accumulés</div>
              <div style={{ background: 'rgba(255,255,255,0.15)', borderRadius: '99px', height: '4px', marginTop: '8px' }}>
                <div style={{ width: `${Math.min((card.balance / total) * 100, 100)}%`, height: '100%', borderRadius: '99px', background: 'rgba(255,255,255,0.6)' }}></div>
              </div>
            </div>
          )}

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '11px', opacity: .6 }}>
            <span>{card.balance} / {total} — {reward}</span>
            <span>{card.customer.email}</span>
          </div>
        </div>
      </div>

      {/* QR Code */}
      <div style={{ background: 'white', borderRadius: '16px', padding: '1.5rem', textAlign: 'center', width: '100%', maxWidth: '340px', border: '0.5px solid #e2e8f0' }}>
        <div style={{ fontSize: '13px', color: '#64748b', marginBottom: '1rem' }}>
          Montrez ce QR code en caisse pour obtenir votre tampon
        </div>
        {qrUrl && <img src={qrUrl} alt="QR Code" style={{ width: '180px', height: '180px', borderRadius: '8px' }} />}
        <div style={{ marginTop: '12px', fontSize: '11px', color: '#94a3b8', fontFamily: 'monospace' }}>{cardId}</div>
      </div>

    </div>
  )
}