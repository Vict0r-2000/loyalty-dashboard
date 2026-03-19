import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../services/api'

export default function Profile() {
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [address, setAddress] = useState('')
  const [website, setWebsite] = useState('')
  const [email, setEmail] = useState('')
  const [saved, setSaved] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    loadProfile()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const loadProfile = async () => {
    try {
      const res = await api.get('/profile')
      const b = res.data.business
      setName(b.name || '')
      setEmail(b.email || '')
      setPhone(b.phone || '')
      setAddress(b.address || '')
      setWebsite(b.website || '')
    } catch {
      navigate('/login')
    }
  }

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      await api.put('/profile', { name, phone, address, website })
      const business = JSON.parse(localStorage.getItem('business') || '{}')
      localStorage.setItem('business', JSON.stringify({ ...business, name }))
      setSaved(true)
      setTimeout(() => setSaved(false), 3000)
    } catch {
      alert('Erreur lors de la sauvegarde')
    }
  }

  return (
    <div style={{ minHeight: '100vh', background: '#f0f4f8' }}>
      <div style={{ background: '#0f2d52', padding: '0 2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', height: '60px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{ width: '28px', height: '28px', background: '#1a4a7a', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '14px' }}>💳</div>
          <span style={{ color: 'white', fontWeight: '500', fontSize: '15px' }}>Loyalty</span>
        </div>
        <button onClick={() => navigate('/dashboard')} style={{ padding: '7px 14px', background: 'rgba(255,255,255,0.1)', color: 'white', border: 'none', borderRadius: '8px', fontSize: '12px', cursor: 'pointer' }}>
          Retour au dashboard
        </button>
      </div>

      <div style={{ maxWidth: '600px', margin: '2rem auto', padding: '0 1rem' }}>
        <h2 style={{ fontSize: '18px', color: '#0f2d52', marginBottom: '1.5rem', fontWeight: '500' }}>Mon profil</h2>

        {saved && (
          <div style={{ background: '#E1F5EE', color: '#0F6E56', padding: '10px 16px', borderRadius: '8px', marginBottom: '1rem', fontSize: '13px' }}>
            Profil sauvegardé avec succès !
          </div>
        )}

        <div style={{ background: 'white', borderRadius: '12px', padding: '1.5rem', border: '0.5px solid #e2e8f0' }}>
          <h3 style={{ margin: '0 0 1rem', fontSize: '14px', color: '#0f2d52', fontWeight: '500' }}>Informations de l'enseigne</h3>
          <form onSubmit={handleSave}>
            <div style={{ marginBottom: '12px' }}>
              <label style={{ fontSize: '12px', color: '#64748b', display: 'block', marginBottom: '4px' }}>Nom de l'enseigne</label>
              <input value={name} onChange={e => setName(e.target.value)} style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #e2e8f0', fontSize: '13px', boxSizing: 'border-box' }} required />
            </div>
            <div style={{ marginBottom: '12px' }}>
              <label style={{ fontSize: '12px', color: '#64748b', display: 'block', marginBottom: '4px' }}>Email</label>
              <input value={email} disabled style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #e2e8f0', fontSize: '13px', boxSizing: 'border-box', background: '#f8fafc', color: '#94a3b8' }} />
              <div style={{ fontSize: '11px', color: '#94a3b8', marginTop: '3px' }}>L'email ne peut pas être modifié</div>
            </div>
            <div style={{ marginBottom: '12px' }}>
              <label style={{ fontSize: '12px', color: '#64748b', display: 'block', marginBottom: '4px' }}>Téléphone</label>
              <input value={phone} onChange={e => setPhone(e.target.value)} placeholder="+32 470 00 00 00" style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #e2e8f0', fontSize: '13px', boxSizing: 'border-box' }} />
            </div>
            <div style={{ marginBottom: '12px' }}>
              <label style={{ fontSize: '12px', color: '#64748b', display: 'block', marginBottom: '4px' }}>Adresse</label>
              <input value={address} onChange={e => setAddress(e.target.value)} placeholder="Rue de la Place 1, Bruxelles" style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #e2e8f0', fontSize: '13px', boxSizing: 'border-box' }} />
            </div>
            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{ fontSize: '12px', color: '#64748b', display: 'block', marginBottom: '4px' }}>Site web</label>
              <input value={website} onChange={e => setWebsite(e.target.value)} placeholder="www.monenseigne.be" style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #e2e8f0', fontSize: '13px', boxSizing: 'border-box' }} />
            </div>
            <button type="submit" style={{ padding: '10px 24px', background: '#0f2d52', color: 'white', border: 'none', borderRadius: '8px', fontSize: '13px', cursor: 'pointer', fontWeight: '500' }}>
              Sauvegarder
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
