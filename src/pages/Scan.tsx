import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../services/api'

export default function Scan() {
  const [cardId, setCardId] = useState('')
  const [result, setResult] = useState<null | { message: string; balance: number; total: number; rewardUnlocked: boolean }>(null)
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const handleScan = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setResult(null)
    try {
      const res = await api.post('/cards/scan', { cardId, amount: 1 })
      setResult(res.data)
      setCardId('')
    } catch {
      alert('Carte introuvable')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ minHeight: '100vh', background: '#f5f5f5', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
      <div style={{ background: 'white', padding: '2rem', borderRadius: '12px', width: '100%', maxWidth: '400px', boxShadow: '0 2px 12px rgba(0,0,0,0.08)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
          <h2 style={{ margin: 0, fontSize: '18px' }}>Scanner</h2>
          <button onClick={() => navigate('/dashboard')} style={{ background: 'transparent', border: 'none', color: '#666', cursor: 'pointer', fontSize: '13px' }}>
            Retour
          </button>
        </div>

        <form onSubmit={handleScan}>
          <div style={{ marginBottom: '1rem' }}>
            <label style={{ fontSize: '13px', color: '#666', display: 'block', marginBottom: '4px' }}>
              ID de la carte client
            </label>
            <input
              value={cardId}
              onChange={e => setCardId(e.target.value)}
              placeholder="Collez l'ID de la carte"
              style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #ddd', fontSize: '14px', boxSizing: 'border-box' }}
              required
              autoFocus
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            style={{ width: '100%', padding: '14px', background: loading ? '#ccc' : '#1D9E75', color: 'white', border: 'none', borderRadius: '8px', fontSize: '15px', cursor: loading ? 'not-allowed' : 'pointer', fontWeight: '500' }}
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
                <div style={{ fontWeight: '500', fontSize: '16px', color: '#534AB7', marginBottom: '4px' }}>Tampon ajouté !</div>
                <div style={{ fontSize: '13px', color: '#534AB7' }}>{result.balance} / {result.total}</div>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  )
}