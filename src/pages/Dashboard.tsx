import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../services/api'

interface Program {
  id: string
  name: string
  type: string
  config: { total?: number; rate?: number; reward?: string }
  active: boolean
}

export default function Dashboard() {
  const [programs, setPrograms] = useState<Program[]>([])
  const [showForm, setShowForm] = useState(false)
  const [programName, setProgramName] = useState('')
  const [programType, setProgramType] = useState('STAMP')
  const [total, setTotal] = useState(9)
  const [reward, setReward] = useState('')
  const navigate = useNavigate()

  const business = JSON.parse(localStorage.getItem('business') || '{}')

  useEffect(() => {
    loadPrograms()
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

  const createProgram = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const config = programType === 'STAMP'
        ? { total, reward }
        : { rate: 1, tiers: [{ pts: total, reward }] }
      await api.post('/programs', { name: programName, type: programType, config })
      setProgramName('')
      setReward('')
      setShowForm(false)
      loadPrograms()
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
    <div style={{ minHeight: '100vh', background: '#f5f5f5' }}>
      <div style={{ background: 'white', padding: '1rem 2rem', borderBottom: '1px solid #eee', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h1 style={{ margin: 0, fontSize: '18px', color: '#534AB7' }}>Loyalty Dashboard</h1>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <span style={{ fontSize: '13px', color: '#666' }}>{business.name}</span>
          <button onClick={() => navigate('/scan')} style={{ padding: '8px 16px', background: '#1D9E75', color: 'white', border: 'none', borderRadius: '8px', fontSize: '13px', cursor: 'pointer' }}>
            Scanner
          </button>
          <button onClick={handleSubscribe} style={{ padding: '8px 16px', background: '#534AB7', color: 'white', border: 'none', borderRadius: '8px', fontSize: '13px', cursor: 'pointer' }}>
            Abonnement
          </button>
          <button onClick={logout} style={{ padding: '8px 16px', background: 'transparent', color: '#666', border: '1px solid #ddd', borderRadius: '8px', fontSize: '13px', cursor: 'pointer' }}>
            Déconnexion
          </button>
        </div>
      </div>

      <div style={{ maxWidth: '800px', margin: '2rem auto', padding: '0 1rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
          <h2 style={{ margin: 0, fontSize: '16px' }}>Mes programmes</h2>
          <button
            onClick={() => setShowForm(!showForm)}
            style={{ padding: '8px 16px', background: '#534AB7', color: 'white', border: 'none', borderRadius: '8px', fontSize: '13px', cursor: 'pointer' }}
          >
            + Nouveau programme
          </button>
        </div>

        {showForm && (
          <div style={{ background: 'white', padding: '1.5rem', borderRadius: '12px', marginBottom: '1.5rem', border: '1px solid #eee' }}>
            <h3 style={{ margin: '0 0 1rem', fontSize: '14px' }}>Créer un programme</h3>
            <form onSubmit={createProgram}>
              <div style={{ marginBottom: '1rem' }}>
                <label style={{ fontSize: '12px', color: '#666', display: 'block', marginBottom: '4px' }}>Nom du programme</label>
                <input
                  value={programName}
                  onChange={e => setProgramName(e.target.value)}
                  placeholder="Ex: Carte café"
                  style={{ width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid #ddd', fontSize: '13px', boxSizing: 'border-box' }}
                  required
                />
              </div>
              <div style={{ marginBottom: '1rem' }}>
                <label style={{ fontSize: '12px', color: '#666', display: 'block', marginBottom: '4px' }}>Type</label>
                <select
                  value={programType}
                  onChange={e => setProgramType(e.target.value)}
                  style={{ width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid #ddd', fontSize: '13px' }}
                >
                  <option value="STAMP">Tampons</option>
                  <option value="POINTS">Points</option>
                </select>
              </div>
              <div style={{ marginBottom: '1rem' }}>
                <label style={{ fontSize: '12px', color: '#666', display: 'block', marginBottom: '4px' }}>
                  {programType === 'STAMP' ? 'Nombre de tampons' : 'Points pour récompense'}
                </label>
                <input
                  type="number"
                  value={total}
                  onChange={e => setTotal(Number(e.target.value))}
                  style={{ width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid #ddd', fontSize: '13px', boxSizing: 'border-box' }}
                  required
                />
              </div>
              <div style={{ marginBottom: '1.5rem' }}>
                <label style={{ fontSize: '12px', color: '#666', display: 'block', marginBottom: '4px' }}>Récompense</label>
                <input
                  value={reward}
                  onChange={e => setReward(e.target.value)}
                  placeholder="Ex: 1 café offert"
                  style={{ width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid #ddd', fontSize: '13px', boxSizing: 'border-box' }}
                  required
                />
              </div>
              <button
                type="submit"
                style={{ padding: '10px 20px', background: '#534AB7', color: 'white', border: 'none', borderRadius: '8px', fontSize: '13px', cursor: 'pointer' }}
              >
                Créer
              </button>
            </form>
          </div>
        )}

        {programs.length === 0 ? (
          <div style={{ background: 'white', padding: '2rem', borderRadius: '12px', textAlign: 'center', color: '#666', fontSize: '14px' }}>
            Aucun programme pour l'instant. Créez votre premier programme !
          </div>
        ) : (
          programs.map(program => (
            <div key={program.id} style={{ background: 'white', padding: '1.25rem', borderRadius: '12px', marginBottom: '1rem', border: '1px solid #eee', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <div style={{ fontWeight: '500', fontSize: '14px', marginBottom: '4px' }}>{program.name}</div>
                <div style={{ fontSize: '12px', color: '#666' }}>
                  {program.type === 'STAMP' ? `${program.config.total} tampons → ${program.config.reward}` : `Points · ${program.config.reward}`}
                </div>
              </div>
              <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                <span style={{ fontSize: '11px', background: program.active ? '#E1F5EE' : '#f5f5f5', color: program.active ? '#0F6E56' : '#666', padding: '3px 10px', borderRadius: '99px' }}>
                  {program.active ? 'Actif' : 'Inactif'}
                </span>
                <button
                  onClick={() => navigate(`/register/${program.id}`)}
                  style={{ padding: '6px 12px', background: '#534AB7', color: 'white', border: 'none', borderRadius: '6px', fontSize: '12px', cursor: 'pointer' }}
                >
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
