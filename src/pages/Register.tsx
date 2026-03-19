import { useState } from 'react'
import { useParams } from 'react-router-dom'
import api from '../services/api'

export default function Register() {
  const { programId } = useParams()
  const [email, setEmail] = useState('')
  const [name, setName] = useState('')
  const [walletLink, setWalletLink] = useState('')
  const [done, setDone] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const res = await api.post('/cards', {
        programId,
        customerEmail: email,
        customerName: name
      })
      setWalletLink(res.data.card.walletLink)
      setDone(true)
    } catch {
      alert("Erreur inscription")
    }
  }

  if (done) {
    return (
      <div style={{ minHeight: '100vh', background: '#f5f5f5', padding: '1rem' }}>
        <div style={{ background: 'white', padding: '2rem', borderRadius: '12px', maxWidth: '400px', margin: '2rem auto', textAlign: 'center' }}>
          <p style={{ fontSize: '48px' }}>🎉</p>
          <h2 style={{ fontSize: '18px' }}>Carte créée !</h2>
          <a href={walletLink} target="_blank" rel="noreferrer" style={{ color: 'white', background: '#1D9E75', padding: '12px 20px', borderRadius: '8px', textDecoration: 'none' }}>
            Ajouter à Google Wallet
          </a>
        </div>
      </div>
    )
  }

  return (
    <div style={{ minHeight: '100vh', background: '#f5f5f5', padding: '1rem' }}>
      <div style={{ background: 'white', padding: '2rem', borderRadius: '12px', maxWidth: '400px', margin: '2rem auto' }}>
        <h2 style={{ fontSize: '18px' }}>Obtenir ma carte</h2>
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '1rem' }}>
            <label style={{ fontSize: '13px', display: 'block', marginBottom: '4px' }}>Prénom</label>
            <input value={name} onChange={e => setName(e.target.value)} placeholder="Marie" style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #ddd', boxSizing: 'border-box' }} required />
          </div>
          <div style={{ marginBottom: '1rem' }}>
            <label style={{ fontSize: '13px', display: 'block', marginBottom: '4px' }}>Email</label>
            <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="marie@email.com" style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #ddd', boxSizing: 'border-box' }} required />
          </div>
          <button type="submit" style={{ width: '100%', padding: '12px', background: '#534AB7', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer' }}>
            Obtenir ma carte
          </button>
        </form>
      </div>
    </div>
  )
}