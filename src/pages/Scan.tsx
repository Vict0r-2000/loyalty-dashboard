import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { Html5Qrcode } from 'html5-qrcode'
import api from '../services/api'

export default function Scan() {
  const [cardId, setCardId] = useState('')
  const [scanning, setScanning] = useState(false)
  const [result, setResult] = useState<null | { message: string; balance: number; total: number; rewardUnlocked: boolean }>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const navigate = useNavigate()
  const scannerRef = useRef<Html5Qrcode | null>(null)

  useEffect(() => {
    return () => {
      if (scannerRef.current) {
        scannerRef.current.stop().catch(() => {})
      }
    }
  }, [])

  const startScanner = async () => {
    setError('')
    setScanning(true)
    try {
      const scanner = new Html5Qrcode('qr-reader')
      scannerRef.current = scanner
      await scanner.start(
        { facingMode: 'environment' },
        { fps: 10, qrbox: { width: 250, height: 250 } },
        async (decodedText) => {
          await scanner.stop()
          setScanning(false)
          setCardId(decodedText)
          await doScan(decodedText)
        },
        () => {}
      )
    } catch {
      setScanning(false)
      setError('Impossible d\'accéder à la caméra. Utilisez la saisie manuelle.')
    }
  }

  const stopScanner = async () => {
    if (scannerRef.current) {
      await scannerRef.current.stop().catch(() => {})
    }
    setScanning(false)
  }

  const doScan = async (id: string) => {
    setLoading(true)
    setResult(null)
    try {
      const res = await api.post('/cards/scan', { cardId: id, amount: 1 })
      setResult(res.data)
      setCardId('')
    } catch {
      setError('Carte introuvable ou erreur serveur')
    } finally {
      setLoading(false)
    }
  }

  const handleManualScan = async (e: React.FormEvent) => {
    e.preventDefault()
    await doScan(cardId)
  }

  return (
    <div style={{ minHeight: '100vh', background: '#f0f4f8' }}>
      <div style={{ background: '#0f2d52', padding: '0 2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', height: '60px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{ width: '28px', height: '28px', background: '#1a4a7a', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '14px' }}>💳</div>
          <span style={{ color: 'white', fontWeight: '500', fontSize: '15px' }}>Loyalty</span>
        </div>
        <button onClick={() => { stopScanner(); navigate('/dashboard') }} style={{ padding: '7px 14px', background: 'rgba(255,255,255,0.1)', color: 'white', border: 'none', borderRadius: '8px', fontSize: '12px', cursor: 'pointer' }}>
          Retour
        </button>
      </div>

      <div style={{ maxWidth: '400px', margin: '2rem auto', padding: '0 1rem' }}>
        <div style={{ background: 'white', borderRadius: '12px', padding: '1.5rem', border: '0.5px solid #e2e8f0' }}>
          <h2 style={{ margin: '0 0 1.5rem', fontSize: '16px', color: '#0f2d52', fontWeight: '500' }}>Scanner une carte</h2>

          {error && (
            <div style={{ background: '#fff0f0', color: '#c0392b', padding: '10px', borderRadius: '8px', marginBottom: '1rem', fontSize: '13px' }}>
              {error}
            </div>
          )}

          {!scanning && !result && (
            <button
              onClick={startScanner}
              style={{ width: '100%', padding: '14px', background: '#0f2d52', color: 'white', border: 'none', borderRadius: '8px', fontSize: '14px', cursor: 'pointer', marginBottom: '1rem', fontWeight: '500' }}
            >
              📷 Scanner le QR code
            </button>
          )}

          {scanning && (
            <div style={{ marginBottom: '1rem' }}>
              <div id="qr-reader" style={{ width: '100%', borderRadius: '8px', overflow: 'hidden' }}></div>
              <button onClick={stopScanner} style={{ width: '100%', padding: '10px', background: '#f0f4f8', color: '#0f2d52', border: 'none', borderRadius: '8px', fontSize: '13px', cursor: 'pointer', marginTop: '8px' }}>
                Annuler
              </button>
            </div>
          )}

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', margin: '1rem 0' }}>
            <div style={{ flex: 1, height: '1px', background: '#e2e8f0' }}></div>
            <span style={{ fontSize: '12px', color: '#94a3b8' }}>ou saisie manuelle</span>
            <div style={{ flex: 1, height: '1px', background: '#e2e8f0' }}></div>
          </div>

          <form onSubmit={handleManualScan}>
            <input
              value={cardId}
              onChange={e => setCardId(e.target.value)}
              placeholder="Collez l'ID de la carte"
              style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #e2e8f0', fontSize: '14px', boxSizing: 'border-box', marginBottom: '10px' }}
              required
            />
            <button
              type="submit"
              disabled={loading}
              style={{ width: '100%', padding: '12px', background: loading ? '#ccc' : '#1D9E75', color: 'white', border: 'none', borderRadius: '8px', fontSize: '14px', cursor: loading ? 'not-allowed' : 'pointer', fontWeight: '500' }}
            >
              {loading ? 'En cours...' : 'Ajouter un tampon'}
            </button>
          </form>

          {result && (
            <div style={{ marginTop: '1.5rem', padding: '1.5rem', borderRadius: '12px', background: result.rewardUnlocked ? '#E1F5EE' : '#f0f0ff', textAlign: 'center' }}>
              {result.rewardUnlocked ? (
                <>
                  <div style={{ fontSize: '40px', marginBottom: '8px' }}>🎉</div>
                  <div style={{ fontWeight: '500', fontSize: '16px', color: '#0F6E56', marginBottom: '4px' }}>Récompense débloquée !</div>
                  <div style={{ fontSize: '13px', color: '#0F6E56' }}>Le compteur repart à zéro</div>
                </>
              ) : (
                <>
                  <div style={{ fontSize: '40px', marginBottom: '8px' }}>✓</div>
                  <div style={{ fontWeight: '500', fontSize: '16px', color: '#0f2d52', marginBottom: '4px' }}>Tampon ajouté !</div>
                  <div style={{ fontSize: '13px', color: '#64748b' }}>{result.balance} / {result.total}</div>
                </>
              )}
              <button onClick={() => setResult(null)} style={{ marginTop: '12px', padding: '8px 20px', background: '#0f2d52', color: 'white', border: 'none', borderRadius: '8px', fontSize: '13px', cursor: 'pointer' }}>
                Scanner suivant
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}