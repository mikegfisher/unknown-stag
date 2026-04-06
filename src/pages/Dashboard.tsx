import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { collection, addDoc, deleteDoc, doc, serverTimestamp } from 'firebase/firestore'
import { db } from '../lib/firebase'
import { useAuth } from '../hooks/useAuth'
import { useSessions } from '../hooks/useSessions'
import type { Session } from '../hooks/useSessions'

export default function Dashboard() {
  const { user, signOut } = useAuth()
  const { sessions, loading } = useSessions(user)
  const navigate = useNavigate()
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [newSessionName, setNewSessionName] = useState('')
  const [creating, setCreating] = useState(false)
  const [sessionToDelete, setSessionToDelete] = useState<Session | null>(null)
  const [deleting, setDeleting] = useState(false)

  async function createSession() {
    if (!user || !newSessionName.trim()) return
    setCreating(true)
    try {
      await addDoc(collection(db, 'sessions'), {
        name: newSessionName.trim(),
        creator_uid: user.uid,
        memberIds: [user.uid],
        integrations: [],
        openIssues: 0,
        revealedIssues: 0,
        createdAt: serverTimestamp(),
      })
      setNewSessionName('')
      setShowCreateModal(false)
    } finally {
      setCreating(false)
    }
  }

  async function deleteSession() {
    if (!sessionToDelete) return
    setDeleting(true)
    try {
      await deleteDoc(doc(db, 'sessions', sessionToDelete.id))
      setSessionToDelete(null)
    } finally {
      setDeleting(false)
    }
  }

  function openCreateModal() {
    setNewSessionName('')
    setShowCreateModal(true)
  }

  function closeCreateModal() {
    setShowCreateModal(false)
    setNewSessionName('')
  }

  function closeDeleteModal() {
    setSessionToDelete(null)
  }

  return (
    <div style={{ minHeight: '100vh', backgroundColor: 'var(--color-background)', padding: '2rem' }}>
      <div style={{ maxWidth: '860px', margin: '0 auto' }}>

        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '2rem' }}>
          <h1 style={{ margin: 0, fontSize: '1.5rem', fontWeight: 600, color: 'var(--color-text-primary)' }}>
            Sessions
          </h1>
          <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
            <button
              onClick={openCreateModal}
              style={{
                backgroundColor: 'var(--color-primary)',
                color: '#fff',
                border: 'none',
                borderRadius: '0.5rem',
                padding: '0.5rem 1rem',
                fontSize: '0.875rem',
                fontWeight: 500,
                cursor: 'pointer',
              }}
            >
              + Create session
            </button>
            <button
              onClick={signOut}
              style={{
                backgroundColor: 'transparent',
                color: 'var(--color-text-secondary)',
                border: '1px solid var(--color-border)',
                borderRadius: '0.5rem',
                padding: '0.5rem 1rem',
                fontSize: '0.875rem',
                cursor: 'pointer',
              }}
            >
              Sign out
            </button>
          </div>
        </div>

        {/* Session list */}
        {loading ? (
          <p style={{ color: 'var(--color-text-secondary)' }}>Loading sessions…</p>
        ) : sessions.length === 0 ? (
          <div
            style={{
              textAlign: 'center',
              padding: '4rem 2rem',
              border: '1px dashed var(--color-border)',
              borderRadius: '0.75rem',
              color: 'var(--color-text-muted)',
            }}
          >
            <p style={{ marginBottom: '0.75rem' }}>No sessions yet.</p>
            <button
              onClick={openCreateModal}
              style={{
                background: 'none',
                border: 'none',
                color: 'var(--color-primary)',
                fontSize: '0.875rem',
                cursor: 'pointer',
              }}
            >
              Create your first session →
            </button>
          </div>
        ) : (
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
              gap: '1rem',
            }}
          >
            {sessions.map((session) => (
              <div
                key={session.id}
                onClick={() => navigate(`/sessions/${session.id}`)}
                style={{
                  backgroundColor: 'var(--color-surface)',
                  border: '1px solid var(--color-border)',
                  borderRadius: '0.75rem',
                  padding: '1.25rem',
                  cursor: 'pointer',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '0.875rem' }}>
                  <h2
                    style={{
                      margin: 0,
                      fontSize: '1rem',
                      fontWeight: 600,
                      color: 'var(--color-text-primary)',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                      flex: 1,
                      minWidth: 0,
                    }}
                  >
                    {session.name}
                  </h2>
                  {user && session.creator_uid === user.uid && (
                    <button
                      onClick={(e) => { e.stopPropagation(); setSessionToDelete(session) }}
                      title="Delete session"
                      style={{
                        marginLeft: '0.5rem',
                        flexShrink: 0,
                        background: 'none',
                        border: 'none',
                        color: 'var(--color-text-muted)',
                        cursor: 'pointer',
                        padding: '0.125rem 0.25rem',
                        fontSize: '0.875rem',
                        borderRadius: '0.25rem',
                        lineHeight: 1,
                      }}
                    >
                      ✕
                    </button>
                  )}
                </div>
                <div style={{ display: 'flex', gap: '1.25rem' }}>
                  <span style={{ fontSize: '0.8125rem', color: 'var(--color-text-secondary)' }}>
                    <span style={{ fontWeight: 600, color: 'var(--color-warning)' }}>
                      {session.openIssues ?? 0}
                    </span>{' '}
                    open
                  </span>
                  <span style={{ fontSize: '0.8125rem', color: 'var(--color-text-secondary)' }}>
                    <span style={{ fontWeight: 600, color: 'var(--color-success)' }}>
                      {session.revealedIssues ?? 0}
                    </span>{' '}
                    revealed
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Create session modal */}
      {showCreateModal && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Create session"
          onClick={(e) => { if (e.target === e.currentTarget) closeCreateModal() }}
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.6)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 50,
          }}
        >
          <div
            style={{
              backgroundColor: 'var(--color-surface-elevated)',
              border: '1px solid var(--color-border)',
              borderRadius: '0.75rem',
              padding: '1.5rem',
              width: '100%',
              maxWidth: '400px',
            }}
          >
            <h2 style={{ margin: '0 0 1rem 0', fontSize: '1.125rem', fontWeight: 600, color: 'var(--color-text-primary)' }}>
              Create session
            </h2>
            <input
              type="text"
              placeholder="Session name"
              value={newSessionName}
              onChange={(e) => setNewSessionName(e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Enter') createSession() }}
              autoFocus
              style={{
                display: 'block',
                width: '100%',
                boxSizing: 'border-box',
                padding: '0.625rem 0.75rem',
                marginBottom: '1rem',
                backgroundColor: 'var(--color-surface)',
                border: '1px solid var(--color-border)',
                borderRadius: '0.5rem',
                color: 'var(--color-text-primary)',
                fontSize: '0.875rem',
                outline: 'none',
              }}
            />
            <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end' }}>
              <button
                onClick={closeCreateModal}
                style={{
                  padding: '0.5rem 1rem',
                  border: '1px solid var(--color-border)',
                  borderRadius: '0.5rem',
                  backgroundColor: 'transparent',
                  color: 'var(--color-text-secondary)',
                  fontSize: '0.875rem',
                  cursor: 'pointer',
                }}
              >
                Cancel
              </button>
              <button
                onClick={createSession}
                disabled={!newSessionName.trim() || creating}
                style={{
                  padding: '0.5rem 1rem',
                  border: 'none',
                  borderRadius: '0.5rem',
                  backgroundColor: !newSessionName.trim() || creating ? 'var(--color-surface)' : 'var(--color-primary)',
                  color: !newSessionName.trim() || creating ? 'var(--color-text-muted)' : '#fff',
                  fontSize: '0.875rem',
                  fontWeight: 500,
                  cursor: !newSessionName.trim() || creating ? 'not-allowed' : 'pointer',
                }}
              >
                {creating ? 'Creating…' : 'Create'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete session confirmation modal */}
      {sessionToDelete && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Delete session"
          onClick={(e) => { if (e.target === e.currentTarget) closeDeleteModal() }}
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.6)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 50,
          }}
        >
          <div
            style={{
              backgroundColor: 'var(--color-surface-elevated)',
              border: '1px solid var(--color-border)',
              borderRadius: '0.75rem',
              padding: '1.5rem',
              width: '100%',
              maxWidth: '400px',
            }}
          >
            <h2 style={{ margin: '0 0 0.5rem 0', fontSize: '1.125rem', fontWeight: 600, color: 'var(--color-text-primary)' }}>
              Delete session?
            </h2>
            <p style={{ margin: '0 0 1.25rem 0', fontSize: '0.875rem', color: 'var(--color-text-secondary)' }}>
              "{sessionToDelete.name}" will be permanently deleted. This cannot be undone.
            </p>
            <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end' }}>
              <button
                onClick={closeDeleteModal}
                disabled={deleting}
                style={{
                  padding: '0.5rem 1rem',
                  border: '1px solid var(--color-border)',
                  borderRadius: '0.5rem',
                  backgroundColor: 'transparent',
                  color: 'var(--color-text-secondary)',
                  fontSize: '0.875rem',
                  cursor: deleting ? 'not-allowed' : 'pointer',
                }}
              >
                Cancel
              </button>
              <button
                onClick={deleteSession}
                disabled={deleting}
                style={{
                  padding: '0.5rem 1rem',
                  border: 'none',
                  borderRadius: '0.5rem',
                  backgroundColor: deleting ? 'var(--color-surface)' : 'var(--color-error)',
                  color: deleting ? 'var(--color-text-muted)' : '#fff',
                  fontSize: '0.875rem',
                  fontWeight: 500,
                  cursor: deleting ? 'not-allowed' : 'pointer',
                }}
              >
                {deleting ? 'Deleting…' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
