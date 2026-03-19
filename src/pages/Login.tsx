import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../services/api'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [isRegister, setIsRegister] = useState(false)
  const [error, setError] = useState('')
  const navigate = useNavigate()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    try {
      const endpoint = isRegister ? '/auth/register' : '/auth/login'
      const payload = isRegister ? { name, email, password } : { email, password }
      const res = await api.post(endpoint, payload)
      localStorage.setItem('token', res.data.token)
      localStorage.setItem('business', JSON.stringify(res.data.business))
      navigate('/dashboard')
    } catch (err: unknown) {
      const error = err as { response?: { data?: { error?: string } } }
      setError(error.response?.data?.error || 'Erreur de connexion')
    }
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f5f5f5' }}>
      <div style={{ background: 'white', padding: '2rem', borderRadius: '12px', width: '100%', maxWidth: '400px', boxShadow: '0 2px 12px rgba(0,0,0,0.08)' }}>
        <h2 style={{ margin: '0 0 1.5rem', fontSize: '20px' }}>
          {isRegister ? 'Créer un compte' : 'Connexion'}
        </h2>

        {error && (
          <div style={{ background: '#fff0f0', color: '#c0392b', padding: '10px', borderRadius: '8px', marginBottom: '1rem', fontSize: '13px' }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {isRegister && (
            <div style={{ marginBottom: '1rem' }}>
              <label style={{ fontSize: '13px', color: '#666', display: 'block', marginBottom: '4px' }}>Nom de l'enseigne</label>
              <input
                type="text"
                value={name}
                onChange={e => setName(e.target.value)}
                placeholder="Ex: Le Petit Café"
                style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #ddd', fontSize: '14px', boxSizing: 'border-box' }}
                required
              />
            </div>
          )}

          <div style={{ marginBottom: '1rem' }}>
            <label style={{ fontSize: '13px', color: '#666', display: 'block', marginBottom: '4px' }}>Email</label>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="contact@monenseigne.be"
              style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #ddd', fontSize: '14px', boxSizing: 'border-box' }}
              required
            />
          </div>

          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{ fontSize: '13px', color: '#666', display: 'block', marginBottom: '4px' }}>Mot de passe</label>
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="••••••••"
              style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #ddd', fontSize: '14px', boxSizing: 'border-box' }}
              required
            />
          </div>

          <button
            type="submit"
            style={{ width: '100%', padding: '12px', background: '#534AB7', color: 'white', border: 'none', borderRadius: '8px', fontSize: '14px', cursor: 'pointer', fontWeight: '500' }}
          >
            {isRegister ? 'Créer mon compte' : 'Se connecter'}
          </button>
        </form>

        <p style={{ textAlign: 'center', marginTop: '1rem', fontSize: '13px', color: '#666' }}>
          {isRegister ? 'Déjà un compte ?' : 'Pas encore de compte ?'}
          {' '}
          <span
            onClick={() => setIsRegister(!isRegister)}
            style={{ color: '#534AB7', cursor: 'pointer', fontWeight: '500' }}
          >
            {isRegister ? 'Se connecter' : 'Créer un compte'}
          </span>
        </p>
      </div>
    </div>
  )
}