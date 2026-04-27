import { useEffect, useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'

type Mode = 'signin' | 'signup' | 'reset'

function firebaseErrorMessage(code: string): string {
  switch (code) {
    case 'auth/wrong-password':
    case 'auth/invalid-credential':
      return 'Incorrect email or password.'
    case 'auth/user-not-found':
      return 'No account found with that email.'
    case 'auth/email-already-in-use':
      return 'An account with that email already exists.'
    case 'auth/weak-password':
      return 'Password must be at least 8 characters.'
    case 'auth/invalid-email':
      return 'Please enter a valid email address.'
    case 'auth/too-many-requests':
      return 'Too many failed attempts. Please try again later.'
    default:
      return 'Something went wrong. Please try again.'
  }
}

export default function LoginPage() {
  const { user, loading, signIn, signInWithEmail, signUpWithEmail, sendPasswordReset } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const from = (location.state as { from?: string } | null)?.from ?? '/dashboard'

  const [mode, setMode] = useState<Mode>('signin')
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [resetSent, setResetSent] = useState(false)

  const [displayName, setDisplayName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({})

  useEffect(() => {
    if (!loading && user) {
      navigate(from, { replace: true })
    }
  }, [user, loading, navigate, from])

  function switchMode(next: Mode) {
    setMode(next)
    setError(null)
    setFieldErrors({})
    setResetSent(false)
  }

  async function handleGoogleSignIn() {
    setError(null)
    setBusy(true)
    try {
      await signIn()
    } catch {
      setError('Sign-in failed. Please try again.')
    } finally {
      setBusy(false)
    }
  }

  function validateSignIn(): boolean {
    const errors: Record<string, string> = {}
    if (!email.trim()) errors.email = 'Email is required.'
    if (!password) errors.password = 'Password is required.'
    setFieldErrors(errors)
    return Object.keys(errors).length === 0
  }

  function validateSignUp(): boolean {
    const errors: Record<string, string> = {}
    if (!displayName.trim()) errors.displayName = 'Display name is required.'
    if (!email.trim()) errors.email = 'Email is required.'
    if (!password) errors.password = 'Password is required.'
    else if (password.length < 8) errors.password = 'Password must be at least 8 characters.'
    setFieldErrors(errors)
    return Object.keys(errors).length === 0
  }

  function validateReset(): boolean {
    const errors: Record<string, string> = {}
    if (!email.trim()) errors.email = 'Email is required.'
    setFieldErrors(errors)
    return Object.keys(errors).length === 0
  }

  async function handleEmailSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)

    if (mode === 'reset') {
      if (!validateReset()) return
      setBusy(true)
      try {
        await sendPasswordReset(email.trim())
        setResetSent(true)
      } catch (err: unknown) {
        const code = (err as { code?: string }).code ?? ''
        setError(firebaseErrorMessage(code))
      } finally {
        setBusy(false)
      }
      return
    }

    if (mode === 'signup') {
      if (!validateSignUp()) return
      setBusy(true)
      try {
        await signUpWithEmail(email.trim(), password, displayName.trim())
      } catch (err: unknown) {
        setError(firebaseErrorMessage((err as { code?: string }).code ?? ''))
      } finally {
        setBusy(false)
      }
      return
    }

    if (!validateSignIn()) return
    setBusy(true)
    try {
      await signInWithEmail(email.trim(), password)
    } catch (err: unknown) {
      setError(firebaseErrorMessage((err as { code?: string }).code ?? ''))
    } finally {
      setBusy(false)
    }
  }

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: 'var(--color-bg-page)' }}>
        <div
          style={{
            width: '2rem',
            height: '2rem',
            borderRadius: '50%',
            border: '3px solid var(--color-border-default)',
            borderTopColor: 'var(--color-primary)',
            animation: 'spin 0.75s linear infinite',
          }}
        />
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    )
  }

  const inputStyle: React.CSSProperties = {
    width: '100%',
    padding: '0.625rem 0.75rem',
    borderRadius: '0.5rem',
    border: '1px solid var(--color-border-default)',
    backgroundColor: 'var(--color-bg-surface)',
    color: 'var(--color-text-primary)',
    fontSize: '0.9375rem',
    outline: 'none',
    boxSizing: 'border-box',
  }

  const errorInputStyle: React.CSSProperties = {
    ...inputStyle,
    borderColor: 'var(--color-error-border)',
  }

  const fieldErrorStyle: React.CSSProperties = {
    fontSize: '0.8125rem',
    color: 'var(--color-error-text)',
    textAlign: 'left',
    marginTop: '0.25rem',
    marginBottom: 0,
  }

  const primaryButtonStyle: React.CSSProperties = {
    width: '100%',
    padding: '0.625rem 1rem',
    borderRadius: '0.5rem',
    border: 'none',
    backgroundColor: busy ? 'var(--color-primary-hover)' : 'var(--color-primary)',
    color: 'var(--color-text-inverse)',
    fontSize: '0.9375rem',
    fontWeight: 600,
    cursor: busy ? 'not-allowed' : 'pointer',
    transition: 'background-color 0.15s',
  }

  const subtitle =
    mode === 'signup'
      ? 'Create your Asyncast account'
      : mode === 'reset'
        ? 'Enter your email to receive a reset link'
        : 'Sign in to continue'

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: 'var(--color-bg-page)' }}>
      <div
        style={{
          backgroundColor: 'var(--color-bg-elevated)',
          border: '1px solid var(--color-border-default)',
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
          {subtitle}
        </p>

        {error && (
          <div
            style={{
              marginBottom: '1rem',
              padding: '0.625rem 0.875rem',
              backgroundColor: 'var(--color-error-bg)',
              border: '1px solid var(--color-error-border)',
              borderRadius: '0.5rem',
              fontSize: '0.875rem',
              color: 'var(--color-error-text)',
              textAlign: 'left',
            }}
          >
            {error}
          </div>
        )}

        {mode !== 'reset' && (
          <>
            <button
              onClick={handleGoogleSignIn}
              disabled={busy}
              style={{
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.75rem',
                border: '1px solid var(--color-border-default)',
                borderRadius: '0.5rem',
                padding: '0.625rem 1rem',
                fontSize: '0.9375rem',
                fontWeight: 500,
                color: busy ? 'var(--color-text-muted)' : 'var(--color-text-primary)',
                backgroundColor: busy ? 'var(--color-bg-surface)' : 'var(--color-bg-elevated)',
                cursor: busy ? 'not-allowed' : 'pointer',
                transition: 'background-color 0.15s',
              }}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05" />
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
              </svg>
              {busy ? 'Signing in…' : 'Sign in with Google'}
            </button>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', margin: '1.25rem 0' }}>
              <hr style={{ flex: 1, border: 'none', borderTop: '1px solid var(--color-border-default)' }} />
              <span style={{ fontSize: '0.8125rem', color: 'var(--color-text-muted)' }}>or</span>
              <hr style={{ flex: 1, border: 'none', borderTop: '1px solid var(--color-border-default)' }} />
            </div>
          </>
        )}

        {resetSent ? (
          <div
            style={{
              padding: '0.875rem',
              backgroundColor: 'var(--color-success-surface)',
              border: '1px solid var(--color-success-border)',
              borderRadius: '0.5rem',
              fontSize: '0.875rem',
              color: 'var(--color-success)',
              textAlign: 'left',
            }}
          >
            Reset email sent! Check your inbox and follow the link to set a new password.
          </div>
        ) : (
          <form onSubmit={handleEmailSubmit} noValidate style={{ textAlign: 'left' }}>
            {mode === 'signup' && (
              <div style={{ marginBottom: '0.75rem' }}>
                <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 500, color: 'var(--color-text-secondary)', marginBottom: '0.375rem' }}>
                  Display name
                </label>
                <input
                  type="text"
                  value={displayName}
                  onChange={e => setDisplayName(e.target.value)}
                  placeholder="Your name"
                  autoComplete="name"
                  style={fieldErrors.displayName ? errorInputStyle : inputStyle}
                />
                {fieldErrors.displayName && <p style={fieldErrorStyle}>{fieldErrors.displayName}</p>}
              </div>
            )}

            <div style={{ marginBottom: '0.75rem' }}>
              <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 500, color: 'var(--color-text-secondary)', marginBottom: '0.375rem' }}>
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="you@example.com"
                autoComplete={mode === 'signup' ? 'email' : 'username'}
                style={fieldErrors.email ? errorInputStyle : inputStyle}
              />
              {fieldErrors.email && <p style={fieldErrorStyle}>{fieldErrors.email}</p>}
            </div>

            {mode !== 'reset' && (
              <div style={{ marginBottom: mode === 'signin' ? '0.375rem' : '1rem' }}>
                <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 500, color: 'var(--color-text-secondary)', marginBottom: '0.375rem' }}>
                  Password
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder={mode === 'signup' ? 'Min. 8 characters' : '••••••••'}
                  autoComplete={mode === 'signup' ? 'new-password' : 'current-password'}
                  style={fieldErrors.password ? errorInputStyle : inputStyle}
                />
                {fieldErrors.password && <p style={fieldErrorStyle}>{fieldErrors.password}</p>}
              </div>
            )}

            {mode === 'signin' && (
              <div style={{ textAlign: 'right', marginBottom: '1rem' }}>
                <button
                  type="button"
                  onClick={() => switchMode('reset')}
                  style={{
                    background: 'none',
                    border: 'none',
                    padding: 0,
                    fontSize: '0.8125rem',
                    color: 'var(--color-primary)',
                    cursor: 'pointer',
                  }}
                >
                  Forgot password?
                </button>
              </div>
            )}

            <button type="submit" disabled={busy} style={primaryButtonStyle}>
              {busy
                ? mode === 'signup' ? 'Creating account…' : mode === 'reset' ? 'Sending…' : 'Signing in…'
                : mode === 'signup' ? 'Create account' : mode === 'reset' ? 'Send reset email' : 'Sign in'}
            </button>
          </form>
        )}

        <div style={{ marginTop: '1.25rem', fontSize: '0.875rem', color: 'var(--color-text-muted)', textAlign: 'center' }}>
          {mode === 'signin' && (
            <>
              Don&apos;t have an account?{' '}
              <button
                type="button"
                onClick={() => switchMode('signup')}
                style={{ background: 'none', border: 'none', padding: 0, color: 'var(--color-primary)', cursor: 'pointer', fontSize: 'inherit' }}
              >
                Sign up
              </button>
            </>
          )}
          {mode === 'signup' && (
            <>
              Already have an account?{' '}
              <button
                type="button"
                onClick={() => switchMode('signin')}
                style={{ background: 'none', border: 'none', padding: 0, color: 'var(--color-primary)', cursor: 'pointer', fontSize: 'inherit' }}
              >
                Sign in
              </button>
            </>
          )}
          {mode === 'reset' && (
            <button
              type="button"
              onClick={() => switchMode('signin')}
              style={{ background: 'none', border: 'none', padding: 0, color: 'var(--color-primary)', cursor: 'pointer', fontSize: 'inherit' }}
            >
              Back to sign in
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
