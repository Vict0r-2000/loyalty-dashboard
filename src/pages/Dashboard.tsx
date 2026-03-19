import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../services/api'

interface Program {
  id: string
  name: string
  type: string
  config: { total?: number; rate?: number; reward?: string }
  color: string
  emoji: string
  active: boolean
}

interface Stats {
  totalCards: number
  totalTransactions: number
  rewards: number
}

export default function Dashboard() {
  const [programs, setPrograms] = useState<Program[]>([])
  const [stats, setStats] = useState<Stats>({ totalCards: 0, totalTransactions: 0, rewards: 0 })
  const [showForm, setShowForm] = useState(false)
  const [programName, setProgramName] = useState('')
  const [programType, setProgramType] = useState('STAMP')
  const [total, setTotal] = useState(9)
  const [reward, setReward] = useState('')
  const [color, setColor] = useState('#1a1035')
  const [emoji, setEmoji] = useState('☕')
  const navigate = useNavigate()

  const business = JSON.parse(localStorage.getItem('business') || '{}')

  const colors = ['#1a1035', '#0c2340', '#1a3a2a', '#3a1a1a', '#2d1a3a', '#1a2a3a', '#3a2a1a', '#1a1a1a']
  const emojis = ['☕', '🥐', '⭐', '🌿', '💆', '🍕', '🌸', '💈', '🍜', '🧁', '🍷', '💇']

  useEffect(() => {
    loadPrograms()
    loadStats()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const loadPrograms = async () => {
    try {
      const res = await api.get('/programs')
      setPrograms(res.data.programs)
    } catch {
      navigate('/login')
    }
  }

  const loadStats = async () => {
    try {
      const res = await api.get('/profile/stats')
      setStats(res.data)
    } catch {
      console.error('Erreur stats')
    }
  }

  const createProgram = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const config = programType === 'STAMP'
        ? { total, reward }
        : { rate: 1, tiers: [{ pts: total, reward }] }
      await api.post('/programs', { name: programName, type: programType, config, color, emoji })
      setProgramName('')
      setReward('')
      setShowForm(false)
      loadPrograms()
      loadStats()
    } catch {
      alert('Erreur lors de la création')
    }
  }

  const handleSubscribe = async () => {
    try {
      const res = await api.post('/billing/create-checkout')
      window.location.href = res.data.url
    } catch {
      alert('Erreur lors de la redirection vers Stripe')
    }
  }

  const logout = () => {
    localStorage.clear()
    navigate('/login')
  }

  return (
    <div style={{ minHeight: '100vh', background: '#f0f4f8' }}>
      {/* Header */}
      <div style={{ background: '#0f2d52', padding: '0 2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', height: '60px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{ width: '28px', height: '28px', background: '#1a4a7a', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '14px' }}>💳</div>
          <span style={{ color: 'white', fontWeight: '500', fontSize: '15px' }}>Loyalty</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <span style={{ fontSize: '13px', color: 'rgba(255,255,255,0.6)' }}>{business.name}</span>
          <button onClick={() => navigate('/scan')} style={{ padding: '7px 14px', background: '#1D9E75', color: 'white', border: 'none', borderRadius: '8px', fontSize: '12px', cursor: 'pointer' }}>
            Scanner
          </button>
          <a href="/profile" style={{ padding: '7px 14px', background: 'rgba(255,255,255,0.1)', color: 'white', borderRadius: '8px', fontSize: '12px', cursor: 'pointer', textDecoration: 'none' }}>
  Profil
</a>
          <button onClick={handleSubscribe} style={{ padding: '7px 14px', background: '#2563EB', color: 'white', border: 'none', borderRadius: '8px', fontSize: '12px', cursor: 'pointer' }}>
            Abonnement
          </button>
          <button onClick={logout} style={{ padding: '7px 14px', background: 'transparent', color: 'rgba(255,255,255,0.6)', border: '1px solid rgba(255,255,255,0.2)', borderRadius: '8px', fontSize: '12px', cursor: 'pointer' }}>
            Déconnexion
          </button>
        </div>
      </div>

      <div style={{ maxWidth: '900px', margin: '0 auto', padding: '2rem 1rem' }}>

        {/* Stats */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px', marginBottom: '2rem' }}>
          {[
            { value: stats.totalCards, label: 'Cartes actives', icon: '💳', color: '#1a4a7a' },
            { value: stats.totalTransactions, label: 'Tampons distribués', icon: '✓', color: '#0F6E56' },
            { value: stats.rewards, label: 'Récompenses', icon: '🎁', color: '#7C3AED' }
          ].map((s, i) => (
            <div key={i} style={{ background: 'white', borderRadius: '12px', padding: '16px 20px', border: '0.5px solid #e2e8f0' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                  <div style={{ fontSize: '28px', fontWeight: '600', color: '#0f2d52' }}>{s.value}</div>
                  <div style={{ fontSize: '12px', color: '#64748b', marginTop: '2px' }}>{s.label}</div>
                </div>
                <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: '#f0f4f8', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '16px' }}>
                  {s.icon}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Header programmes */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
          <h2 style={{ margin: 0, fontSize: '16px', color: '#0f2d52', fontWeight: '500' }}>Mes programmes</h2>
          <button onClick={() => setShowForm(!showForm)} style={{ padding: '8px 16px', background: '#0f2d52', color: 'white', border: 'none', borderRadius: '8px', fontSize: '13px', cursor: 'pointer' }}>
            + Nouveau
          </button>
        </div>

        {/* Formulaire création */}
        {showForm && (
          <div style={{ background: 'white', padding: '1.5rem', borderRadius: '12px', marginBottom: '1rem', border: '0.5px solid #e2e8f0' }}>
            <h3 style={{ margin: '0 0 1rem', fontSize: '14px', color: '#0f2d52' }}>Créer un programme</h3>
            <form onSubmit={createProgram}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '12px' }}>
                <div>
                  <label style={{ fontSize: '12px', color: '#64748b', display: 'block', marginBottom: '4px' }}>Nom</label>
                  <input value={programName} onChange={e => setProgramName(e.target.value)} placeholder="Ex: Carte café" style={{ width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid #e2e8f0', fontSize: '13px', boxSizing: 'border-box' }} required />
                </div>
                <div>
                  <label style={{ fontSize: '12px', color: '#64748b', display: 'block', marginBottom: '4px' }}>Type</label>
                  <select value={programType} onChange={e => setProgramType(e.target.value)} style={{ width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid #e2e8f0', fontSize: '13px' }}>
                    <option value="STAMP">Tampons</option>
                    <option value="POINTS">Points</option>
                  </select>
                </div>
                <div>
                  <label style={{ fontSize: '12px', color: '#64748b', display: 'block', marginBottom: '4px' }}>{programType === 'STAMP' ? 'Nombre de tampons' : 'Points objectif'}</label>
                  <input type="number" value={total} onChange={e => setTotal(Number(e.target.value))} style={{ width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid #e2e8f0', fontSize: '13px', boxSizing: 'border-box' }} required />
                </div>
                <div>
                  <label style={{ fontSize: '12px', color: '#64748b', display: 'block', marginBottom: '4px' }}>Récompense</label>
                  <input value={reward} onChange={e => setReward(e.target.value)} placeholder="Ex: 1 café offert" style={{ width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid #e2e8f0', fontSize: '13px', boxSizing: 'border-box' }} required />
                </div>
              </div>

              <div style={{ marginBottom: '12px' }}>
                <label style={{ fontSize: '12px', color: '#64748b', display: 'block', marginBottom: '6px' }}>Couleur de la carte</label>
                <div style={{ display: 'flex', gap: '8px' }}>
                  {colors.map(c => (
                    <div key={c} onClick={() => setColor(c)} style={{ width: '28px', height: '28px', borderRadius: '50%', background: c, cursor: 'pointer', border: color === c ? '3px solid #0f2d52' : '2px solid transparent', boxSizing: 'border-box' }} />
                  ))}
                </div>
              </div>

              <div style={{ marginBottom: '16px' }}>
                <label style={{ fontSize: '12px', color: '#64748b', display: 'block', marginBottom: '6px' }}>Icône / motif</label>
                <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                  {emojis.map(em => (
                    <div key={em} onClick={() => setEmoji(em)} style={{ width: '36px', height: '36px', borderRadius: '8px', background: emoji === em ? '#f0f4f8' : 'transparent', border: emoji === em ? '2px solid #0f2d52' : '1px solid #e2e8f0', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px', cursor: 'pointer' }}>
                      {em}
                    </div>
                  ))}
                </div>
              </div>

              {/* Preview carte */}
              <div style={{ marginBottom: '16px' }}>
                <label style={{ fontSize: '12px', color: '#64748b', display: 'block', marginBottom: '6px' }}>Aperçu</label>
                <div style={{ background: color, borderRadius: '12px', padding: '16px', color: 'white', position: 'relative', overflow: 'hidden', maxWidth: '280px' }}>
                  <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, fontSize: '24px', lineHeight: '1.4', opacity: .07, wordBreak: 'break-all', padding: '8px', pointerEvents: 'none' }}>
                    {emoji.repeat(40)}
                  </div>
                  <div style={{ position: 'relative', zIndex: 1 }}>
                    <div style={{ fontSize: '10px', opacity: .6, letterSpacing: '.1em', textTransform: 'uppercase' }}>{business.name}</div>
                    <div style={{ fontSize: '14px', fontWeight: '500', margin: '4px 0 10px' }}>{programName || 'Nom du programme'}</div>
                    <div style={{ display: 'flex', gap: '5px', marginBottom: '10px' }}>
                      {Array.from({ length: Math.min(total, 9) }).map((_, i) => (
                        <div key={i} style={{ width: '22px', height: '22px', borderRadius: '50%', background: 'rgba(255,255,255,0.2)', border: '1px dashed rgba(255,255,255,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '10px' }}>
                          {i === Math.min(total, 9) - 1 ? '🎁' : emoji}
                        </div>
                      ))}
                    </div>
                    <div style={{ fontSize: '10px', opacity: .5 }}>0 / {total} • {reward || 'récompense'}</div>
                  </div>
                </div>
              </div>

              <button type="submit" style={{ padding: '10px 20px', background: '#0f2d52', color: 'white', border: 'none', borderRadius: '8px', fontSize: '13px', cursor: 'pointer' }}>
                Créer le programme
              </button>
            </form>
          </div>
        )}

        {/* Liste programmes */}
        {programs.length === 0 ? (
          <div style={{ background: 'white', padding: '3rem', borderRadius: '12px', textAlign: 'center', color: '#64748b', fontSize: '14px', border: '0.5px solid #e2e8f0' }}>
            <div style={{ fontSize: '32px', marginBottom: '8px' }}>💳</div>
            Aucun programme pour l'instant. Créez votre premier programme !
          </div>
        ) : (
          programs.map(program => (
            <div key={program.id} style={{ background: 'white', padding: '16px 20px', borderRadius: '12px', marginBottom: '10px', border: '0.5px solid #e2e8f0', display: 'flex', alignItems: 'center', gap: '14px' }}>
              <div style={{ width: '44px', height: '44px', borderRadius: '12px', background: program.color || '#1a1035', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px', flexShrink: 0 }}>
                {program.emoji || '⭐'}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: '500', fontSize: '14px', color: '#0f2d52' }}>{program.name}</div>
                <div style={{ fontSize: '12px', color: '#64748b', marginTop: '2px' }}>
                  {program.type === 'STAMP' ? `${program.config.total} tampons → ${program.config.reward}` : `Points · ${program.config.reward}`}
                </div>
              </div>
              <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                <span style={{ fontSize: '11px', background: '#E1F5EE', color: '#0F6E56', padding: '3px 10px', borderRadius: '99px' }}>
                  {program.active ? 'Actif' : 'Inactif'}
                </span>
                <button onClick={() => navigate(`/register/${program.id}`)} style={{ padding: '7px 14px', background: '#0f2d52', color: 'white', border: 'none', borderRadius: '8px', fontSize: '12px', cursor: 'pointer' }}>
                  Inscrire client
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}