import { useState } from 'react'
import { useParams } from 'react-router-dom'
import api from '../services/api'

export default function Register() {
  const { programId } = useParams()
  const [email, setEmail] = useState('')
  const [name, setName] = useState('')
  const [cardId, setCardId] = useState('')
  const [done, setDone] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const res = await api.post('/cards', {
        programId,
        customerEmail: email,
        customerName: name
      })
      setCardId(res.data.card.id)
      setDone(true)
    } catch {
      alert("Erreur inscription")
    }
  }

  if (done) {
    return (
      <div style={{ minHeight: '100vh', background: '#f0f4f8', padding: '1rem' }}>
        <div style={{ background: 'white', padding: '2rem', borderRadius: '12px', maxWidth: '400px', margin: '2rem auto', textAlign: 'center' }}>
          <p style={{ fontSize: '48px', margin: '0 0 1rem' }}>🎉</p>
          <h2 style={{ fontSize: '18px', margin: '0 0 0.5rem', color: '#0f2d52' }}>Carte créée !</h2>
          <p style={{ color: '#64748b', fontSize: '13px', marginBottom: '1.5rem' }}>
            Votre carte de fidélité est prête.
          </p>
          <a href={`/card/${cardId}`} style={{ padding: '12px 24px', background: '#0f2d52', color: 'white', borderRadius: '8px', textDecoration: 'none', fontSize: '14px' }}>
            Voir ma carte
          </a>
        </div>
      </div>
    )
  }

  return (
    <div style={{ minHeight: '100vh', background: '#f0f4f8', padding: '1rem' }}>
      <div style={{ background: 'white', padding: '2rem', borderRadius: '12px', maxWidth: '400px', margin: '2rem auto' }}>
        <h2 style={{ margin: '0 0 0.5rem', fontSize: '18px', color: '#0f2d52' }}>Obtenir ma carte</h2>
        <p style={{ color: '#64748b', fontSize: '13px', marginBottom: '1.5rem' }}>
          Inscrivez-vous pour recevoir votre carte de fidélité.
        </p>
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '1rem' }}>
            <label style={{ fontSize: '13px', color: '#64748b', display: 'block', marginBottom: '4px' }}>Prénom</label>
            <input value={name} onChange={e => setName(e.target.value)} placeholder="Marie" style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #e2e8f0', fontSize: '14px', boxSizing: 'border-box' }} required />
          </div>
          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{ fontSize: '13px', color: '#64748b', display: 'block', marginBottom: '4px' }}>Email</label>
            <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="marie@email.com" style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #e2e8f0', fontSize: '14px', boxSizing: 'border-box' }} required />
          </div>
          <button type="submit" style={{ width: '100%', padding: '12px', background: '#0f2d52', color: 'white', border: 'none', borderRadius: '8px', fontSize: '14px', cursor: 'pointer' }}>
            Obtenir ma carte
          </button>
        </form>
      </div>
    </div>
  )
}
