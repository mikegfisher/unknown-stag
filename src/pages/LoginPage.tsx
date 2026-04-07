import { useEffect, useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'

export default function LoginPage() {
  const { user, loading, signIn } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const from = (location.state as { from?: string } | null)?.from ?? '/dashboard'
  const [signingIn, setSigningIn] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!loading && user) {
      navigate(from, { replace: true })
    }
  }, [user, loading, navigate, from])

  async function handleSignIn() {
    setError(null)
    setSigningIn(true)
    try {
      await signIn()
    } catch {
      setError('Sign-in failed. Please try again.')
    } finally {
      setSigningIn(false)
    }
  }

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: 'var(--color-background)' }}>
        <div
          style={{
            width: '2rem',
            height: '2rem',
            borderRadius: '50%',
            border: '3px solid var(--color-border)',
            borderTopColor: 'var(--color-primary)',
            animation: 'spin 0.75s linear infinite',
          }}
        />
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    )
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: 'var(--color-background)' }}>
      <div
        style={{
          backgroundColor: 'var(--color-surface-elevated)',
          border: '1px solid var(--color-border)',
          padding: '2rem',
          borderRadius: '1rem',
          width: '100%',
          maxWidth: '360px',
          textAlign: 'center',
        }}
      >
        <h1 style={{ margin: '0 0 0.375rem 0', fontSize: '1.5rem', fontWeight: 600, color: 'var(--color-text-primary)' }}>
          Asyncast
        </h1>
        <p style={{ margin: '0 0 1.5rem 0', fontSize: '0.9375rem', color: 'var(--color-text-secondary)' }}>
          Sign in to continue
        </p>

        {error && (
          <div
            style={{
              marginBottom: '1rem',
              padding: '0.625rem 0.875rem',
              backgroundColor: 'var(--color-warning-surface)',
              border: '1px solid var(--color-warning-border)',
              borderRadius: '0.5rem',
              fontSize: '0.875rem',
              color: 'var(--color-warning)',
              textAlign: 'left',
            }}
          >
            {error}
          </div>
        )}

        <button
          onClick={handleSignIn}
          disabled={signingIn}
          style={{
            width: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0.75rem',
            border: '1px solid var(--color-border)',
            borderRadius: '0.5rem',
            padding: '0.625rem 1rem',
            fontSize: '0.9375rem',
            fontWeight: 500,
            color: signingIn ? 'var(--color-text-muted)' : 'var(--color-text-primary)',
            backgroundColor: signingIn ? 'var(--color-surface)' : 'var(--color-surface-elevated)',
            cursor: signingIn ? 'not-allowed' : 'pointer',
            transition: 'background-color 0.15s',
          }}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true">
            <path
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              fill="#4285F4"
            />
            <path
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              fill="#34A853"
            />
            <path
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"
              fill="#FBBC05"
            />
            <path
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              fill="#EA4335"
            />
          </svg>
          {signingIn ? 'Signing in…' : 'Sign in with Google'}
        </button>
      </div>
    </div>
  )
}
