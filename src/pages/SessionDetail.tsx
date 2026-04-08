import { useState, useEffect, useRef } from 'react'
import { useParams, useNavigate, useSearchParams } from 'react-router-dom'
import { doc, updateDoc, arrayUnion } from 'firebase/firestore'
import { db } from '../lib/firebase'
import { useAuth } from '../hooks/useAuth'
import { useSession } from '../hooks/useSession'
import { useIssues } from '../hooks/useIssues'
import type { Issue } from '../hooks/useIssues'
import { roundUpToFibonacci } from '../lib/fibonacci'
import { ReadinessGuide, getReadinessLabel } from '../components/ReadinessGuide'

export default function SessionDetail() {
  const { sessionId } = useParams<{ sessionId: string }>()
  const navigate = useNavigate()
  const [searchParams, setSearchParams] = useSearchParams()
  const { user } = useAuth()
  const { session, loading: sessionLoading, error: sessionError } = useSession(sessionId)
  const { issues, loading: issuesLoading, error: issuesError, addIssue, deleteIssue, castVote, revealVotes, reopenIssue } =
    useIssues(sessionId, user)

  const [showAddModal, setShowAddModal] = useState(false)
  const [newTitle, setNewTitle] = useState('')
  const [newDescription, setNewDescription] = useState('')
  const [newExternalUrl, setNewExternalUrl] = useState('')
  const [adding, setAdding] = useState(false)
  const [issueToDelete, setIssueToDelete] = useState<Issue | null>(null)
  const [deleting, setDeleting] = useState(false)
  const [issueToReopen, setIssueToReopen] = useState<Issue | null>(null)
  const [reopening, setReopening] = useState(false)
  const [showInviteModal, setShowInviteModal] = useState(false)
  const [inviteLinkCopied, setInviteLinkCopied] = useState(false)
  const [generatingToken, setGeneratingToken] = useState(false)

  const isOwner = user && session && session.creator_uid === user.uid
  const isMember = user && session ? session.memberIds.includes(user.uid) : false

  // Auto-join when visiting with a valid invite token
  const joinedRef = useRef(false)
  const inviteToken = searchParams.get('invite')
  useEffect(() => {
    if (!session || !user || !inviteToken || joinedRef.current) return
    if (session.inviteToken !== inviteToken) return
    if (session.memberIds.includes(user.uid)) {
      // Already a member — just clean up the URL
      setSearchParams({}, { replace: true })
      return
    }
    joinedRef.current = true
    updateDoc(doc(db, 'sessions', session.id), {
      memberIds: arrayUnion(user.uid),
    }).then(() => {
      setSearchParams({}, { replace: true })
    })
  }, [session, user, inviteToken, setSearchParams])

  async function openInviteModal() {
    setShowInviteModal(true)
    if (session && !session.inviteToken) {
      setGeneratingToken(true)
      try {
        await updateDoc(doc(db, 'sessions', session.id), {
          inviteToken: crypto.randomUUID(),
        })
      } finally {
        setGeneratingToken(false)
      }
    }
  }

  const inviteLink = session?.inviteToken
    ? `${window.location.origin}/sessions/${session.id}?invite=${session.inviteToken}`
    : null

  async function copyInviteLink() {
    if (!inviteLink) return
    await navigator.clipboard.writeText(inviteLink)
    setInviteLinkCopied(true)
    setTimeout(() => setInviteLinkCopied(false), 2000)
  }

  async function handleAddIssue() {
    if (!newTitle.trim()) return
    setAdding(true)
    try {
      await addIssue(newTitle, newDescription, newExternalUrl)
      setNewTitle('')
      setNewDescription('')
      setNewExternalUrl('')
      setShowAddModal(false)
    } finally {
      setAdding(false)
    }
  }

  async function handleDeleteIssue() {
    if (!issueToDelete) return
    setDeleting(true)
    try {
      await deleteIssue(issueToDelete.id)
      setIssueToDelete(null)
    } finally {
      setDeleting(false)
    }
  }

  async function handleReopenIssue() {
    if (!issueToReopen) return
    setReopening(true)
    try {
      await reopenIssue(issueToReopen.id)
      setIssueToReopen(null)
    } finally {
      setReopening(false)
    }
  }

  function openAddModal() {
    setNewTitle('')
    setNewDescription('')
    setNewExternalUrl('')
    setShowAddModal(true)
  }

  if (sessionLoading) {
    return (
      <div style={{ minHeight: '100vh', backgroundColor: 'var(--color-bg-page)', padding: '2rem' }}>
        <p style={{ color: 'var(--color-text-secondary)' }}>Loading…</p>
      </div>
    )
  }

  if (sessionError) {
    return (
      <div style={{ minHeight: '100vh', backgroundColor: 'var(--color-bg-page)', padding: '2rem' }}>
        <div
          style={{
            padding: '0.875rem 1rem',
            backgroundColor: 'var(--color-warning-surface)',
            border: '1px solid var(--color-warning-border)',
            borderRadius: '0.5rem',
            fontSize: '0.875rem',
            color: 'var(--color-warning)',
            marginBottom: '1rem',
          }}
        >
          {sessionError}
        </div>
        <button
          onClick={() => navigate('/dashboard')}
          style={{ background: 'none', border: 'none', color: 'var(--color-primary)', cursor: 'pointer' }}
        >
          ← Back to dashboard
        </button>
      </div>
    )
  }

  if (!session) {
    return (
      <div style={{ minHeight: '100vh', backgroundColor: 'var(--color-bg-page)', padding: '2rem' }}>
        <p style={{ color: 'var(--color-text-secondary)', marginBottom: '0.75rem' }}>Session not found.</p>
        <button
          onClick={() => navigate('/dashboard')}
          style={{ background: 'none', border: 'none', color: 'var(--color-primary)', cursor: 'pointer' }}
        >
          ← Back to dashboard
        </button>
      </div>
    )
  }

  return (
    <div style={{ minHeight: '100vh', backgroundColor: 'var(--color-bg-page)', padding: '2rem' }}>
      <div style={{ maxWidth: '720px', margin: '0 auto' }}>

        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '2rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', minWidth: 0 }}>
            <button
              onClick={() => navigate('/dashboard')}
              style={{
                background: 'none',
                border: 'none',
                color: 'var(--color-text-secondary)',
                cursor: 'pointer',
                fontSize: '1.25rem',
                padding: '0.25rem',
                flexShrink: 0,
              }}
              title="Back to dashboard"
            >
              ←
            </button>
            <h1
              style={{
                margin: 0,
                fontSize: '1.5rem',
                fontWeight: 600,
                color: 'var(--color-text-primary)',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
              }}
            >
              {session.name}
            </h1>
          </div>
          <div style={{ display: 'flex', gap: '0.5rem', flexShrink: 0 }}>
            {isOwner && (
              <button
                onClick={openInviteModal}
                style={{
                  backgroundColor: 'transparent',
                  color: 'var(--color-text-secondary)',
                  border: '1px solid var(--color-border-default)',
                  borderRadius: '0.5rem',
                  padding: '0.5rem 1rem',
                  fontSize: '0.875rem',
                  fontWeight: 500,
                  cursor: 'pointer',
                }}
              >
                Invite
              </button>
            )}
            {isOwner && (
              <button
                onClick={openAddModal}
                style={{
                  backgroundColor: 'var(--color-primary)',
                  color: 'var(--color-text-inverse)',
                  border: 'none',
                  borderRadius: '0.5rem',
                  padding: '0.5rem 1rem',
                  fontSize: '0.875rem',
                  fontWeight: 500,
                  cursor: 'pointer',
                }}
              >
                + Add issue
              </button>
            )}
          </div>
        </div>

        {/* Non-member notice */}
        {!isMember && user && !inviteToken && (
          <div
            style={{
              marginBottom: '1.25rem',
              padding: '0.75rem 1rem',
              backgroundColor: 'var(--color-warning-surface)',
              border: '1px solid var(--color-warning-border)',
              borderRadius: '0.5rem',
              fontSize: '0.875rem',
              color: 'var(--color-warning)',
            }}
          >
            You are viewing this backlog as a guest and cannot vote. Ask the backlog owner for an invite link to join.
          </div>
        )}

        {/* Issue list */}
        {issuesLoading ? (
          <p style={{ color: 'var(--color-text-secondary)' }}>Loading issues…</p>
        ) : issuesError ? (
          <div
            style={{
              padding: '0.875rem 1rem',
              backgroundColor: 'var(--color-warning-surface)',
              border: '1px solid var(--color-warning-border)',
              borderRadius: '0.5rem',
              fontSize: '0.875rem',
              color: 'var(--color-warning)',
            }}
          >
            {issuesError}
          </div>
        ) : issues.length === 0 ? (
          <div
            style={{
              textAlign: 'center',
              padding: '4rem 2rem',
              border: '1px dashed var(--color-border-default)',
              borderRadius: '0.75rem',
              color: 'var(--color-text-muted)',
            }}
          >
            <p style={{ marginBottom: '0.75rem' }}>No issues yet.</p>
            {isOwner && (
              <button
                onClick={openAddModal}
                style={{
                  background: 'none',
                  border: 'none',
                  color: 'var(--color-primary)',
                  fontSize: '0.875rem',
                  cursor: 'pointer',
                }}
              >
                Add your first issue →
              </button>
            )}
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {issues.filter(i => !i.revealed).map((issue) => (
              <IssueRow
                key={issue.id}
                issue={issue}
                isOwner={!!isOwner}
                isMember={!!isMember}
                currentUserId={user?.uid ?? null}
                onDelete={() => setIssueToDelete(issue)}
                onVote={(value) => castVote(issue.id, value)}
                onReveal={() => revealVotes(issue.id)}
                onReopen={() => setIssueToReopen(issue)}
              />
            ))}
            {issues.some(i => i.revealed) && issues.some(i => !i.revealed) && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.25rem 0' }}>
                <div style={{ flex: 1, height: '1px', backgroundColor: 'var(--color-border-default)' }} />
                <span style={{ fontSize: '0.6875rem', fontWeight: 600, color: 'var(--color-text-muted)', letterSpacing: '0.05em', textTransform: 'uppercase' }}>
                  Revealed
                </span>
                <div style={{ flex: 1, height: '1px', backgroundColor: 'var(--color-border-default)' }} />
              </div>
            )}
            {issues.filter(i => i.revealed).map((issue) => (
              <IssueRow
                key={issue.id}
                issue={issue}
                isOwner={!!isOwner}
                isMember={!!isMember}
                currentUserId={user?.uid ?? null}
                onDelete={() => setIssueToDelete(issue)}
                onVote={(value) => castVote(issue.id, value)}
                onReveal={() => revealVotes(issue.id)}
                onReopen={() => setIssueToReopen(issue)}
              />
            ))}
          </div>
        )}
      </div>

      {/* Invite modal */}
      {showInviteModal && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Invite teammates"
          onClick={(e) => { if (e.target === e.currentTarget) setShowInviteModal(false) }}
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'var(--color-overlay)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 50,
          }}
        >
          <div
            style={{
              backgroundColor: 'var(--color-bg-elevated)',
              border: '1px solid var(--color-border-default)',
              borderRadius: '0.75rem',
              padding: '1.5rem',
              width: '100%',
              maxWidth: '480px',
            }}
          >
            <h2 style={{ margin: '0 0 0.5rem 0', fontSize: '1.125rem', fontWeight: 600, color: 'var(--color-text-primary)' }}>
              Invite teammates
            </h2>
            <p style={{ margin: '0 0 1rem 0', fontSize: '0.875rem', color: 'var(--color-text-secondary)' }}>
              Share this link to invite others to vote in this backlog. Anyone with the link can join.
            </p>
            {generatingToken ? (
              <p style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)' }}>Generating invite link…</p>
            ) : (
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <input
                  type="text"
                  readOnly
                  value={inviteLink ?? ''}
                  onClick={(e) => (e.target as HTMLInputElement).select()}
                  style={{
                    flex: 1,
                    padding: '0.625rem 0.75rem',
                    backgroundColor: 'var(--color-bg-surface)',
                    border: '1px solid var(--color-border-default)',
                    borderRadius: '0.5rem',
                    color: 'var(--color-text-secondary)',
                    fontSize: '0.8125rem',
                    outline: 'none',
                    minWidth: 0,
                  }}
                />
                <button
                  onClick={copyInviteLink}
                  style={{
                    flexShrink: 0,
                    padding: '0.625rem 1rem',
                    border: 'none',
                    borderRadius: '0.5rem',
                    backgroundColor: inviteLinkCopied ? 'var(--color-success)' : 'var(--color-primary)',
                    color: 'var(--color-text-inverse)',
                    fontSize: '0.875rem',
                    fontWeight: 500,
                    cursor: 'pointer',
                    transition: 'background-color 0.15s',
                  }}
                >
                  {inviteLinkCopied ? 'Copied!' : 'Copy'}
                </button>
              </div>
            )}
            <div style={{ marginTop: '1.25rem', display: 'flex', justifyContent: 'flex-end' }}>
              <button
                onClick={() => setShowInviteModal(false)}
                style={{
                  padding: '0.5rem 1rem',
                  border: '1px solid var(--color-border-default)',
                  borderRadius: '0.5rem',
                  backgroundColor: 'transparent',
                  color: 'var(--color-text-secondary)',
                  fontSize: '0.875rem',
                  cursor: 'pointer',
                }}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add issue modal */}
      {showAddModal && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Add issue"
          onClick={(e) => { if (e.target === e.currentTarget) setShowAddModal(false) }}
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'var(--color-overlay)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 50,
          }}
        >
          <div
            style={{
              backgroundColor: 'var(--color-bg-elevated)',
              border: '1px solid var(--color-border-default)',
              borderRadius: '0.75rem',
              padding: '1.5rem',
              width: '100%',
              maxWidth: '480px',
            }}
          >
            <h2 style={{ margin: '0 0 1rem 0', fontSize: '1.125rem', fontWeight: 600, color: 'var(--color-text-primary)' }}>
              Add issue
            </h2>
            <input
              type="text"
              placeholder="Issue title"
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) handleAddIssue() }}
              autoFocus
              style={{
                display: 'block',
                width: '100%',
                boxSizing: 'border-box',
                padding: '0.625rem 0.75rem',
                marginBottom: '0.75rem',
                backgroundColor: 'var(--color-bg-surface)',
                border: '1px solid var(--color-border-default)',
                borderRadius: '0.5rem',
                color: 'var(--color-text-primary)',
                fontSize: '0.875rem',
                outline: 'none',
              }}
            />
            <input
              type="url"
              placeholder="External link (optional)"
              value={newExternalUrl}
              onChange={(e) => setNewExternalUrl(e.target.value)}
              style={{
                display: 'block',
                width: '100%',
                boxSizing: 'border-box',
                padding: '0.625rem 0.75rem',
                marginBottom: '0.75rem',
                backgroundColor: 'var(--color-bg-surface)',
                border: '1px solid var(--color-border-default)',
                borderRadius: '0.5rem',
                color: 'var(--color-text-primary)',
                fontSize: '0.875rem',
                outline: 'none',
              }}
            />
            <textarea
              placeholder="Description (optional)"
              value={newDescription}
              onChange={(e) => setNewDescription(e.target.value)}
              rows={3}
              style={{
                display: 'block',
                width: '100%',
                boxSizing: 'border-box',
                padding: '0.625rem 0.75rem',
                marginBottom: '1rem',
                backgroundColor: 'var(--color-bg-surface)',
                border: '1px solid var(--color-border-default)',
                borderRadius: '0.5rem',
                color: 'var(--color-text-primary)',
                fontSize: '0.875rem',
                outline: 'none',
                resize: 'vertical',
                fontFamily: 'inherit',
              }}
            />
            <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end' }}>
              <button
                onClick={() => setShowAddModal(false)}
                style={{
                  padding: '0.5rem 1rem',
                  border: '1px solid var(--color-border-default)',
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
                onClick={handleAddIssue}
                disabled={!newTitle.trim() || adding}
                style={{
                  padding: '0.5rem 1rem',
                  border: 'none',
                  borderRadius: '0.5rem',
                  backgroundColor: !newTitle.trim() || adding ? 'var(--color-bg-surface)' : 'var(--color-primary)',
                  color: !newTitle.trim() || adding ? 'var(--color-text-muted)' : 'var(--color-text-inverse)',
                  fontSize: '0.875rem',
                  fontWeight: 500,
                  cursor: !newTitle.trim() || adding ? 'not-allowed' : 'pointer',
                }}
              >
                {adding ? 'Adding…' : 'Add'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete issue confirmation modal */}
      {issueToDelete && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Delete issue"
          onClick={(e) => { if (e.target === e.currentTarget) setIssueToDelete(null) }}
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'var(--color-overlay)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 50,
          }}
        >
          <div
            style={{
              backgroundColor: 'var(--color-bg-elevated)',
              border: '1px solid var(--color-border-default)',
              borderRadius: '0.75rem',
              padding: '1.5rem',
              width: '100%',
              maxWidth: '400px',
            }}
          >
            <h2 style={{ margin: '0 0 0.5rem 0', fontSize: '1.125rem', fontWeight: 600, color: 'var(--color-text-primary)' }}>
              Delete issue?
            </h2>
            <p style={{ margin: '0 0 1.25rem 0', fontSize: '0.875rem', color: 'var(--color-text-secondary)' }}>
              "{issueToDelete.title}" will be permanently deleted. This cannot be undone.
            </p>
            <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end' }}>
              <button
                onClick={() => setIssueToDelete(null)}
                disabled={deleting}
                style={{
                  padding: '0.5rem 1rem',
                  border: '1px solid var(--color-border-default)',
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
                onClick={handleDeleteIssue}
                disabled={deleting}
                style={{
                  padding: '0.5rem 1rem',
                  border: 'none',
                  borderRadius: '0.5rem',
                  backgroundColor: deleting ? 'var(--color-bg-surface)' : 'var(--color-error)',
                  color: deleting ? 'var(--color-text-muted)' : 'var(--color-text-inverse)',
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

      {/* Reopen issue confirmation modal */}
      {issueToReopen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Reopen issue"
          onClick={(e) => { if (e.target === e.currentTarget) setIssueToReopen(null) }}
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'var(--color-overlay)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 50,
          }}
        >
          <div
            style={{
              backgroundColor: 'var(--color-bg-elevated)',
              border: '1px solid var(--color-border-default)',
              borderRadius: '0.75rem',
              padding: '1.5rem',
              width: '100%',
              maxWidth: '400px',
            }}
          >
            <h2 style={{ margin: '0 0 0.5rem 0', fontSize: '1.125rem', fontWeight: 600, color: 'var(--color-text-primary)' }}>
              Reopen issue?
            </h2>
            <p style={{ margin: '0 0 1.25rem 0', fontSize: '0.875rem', color: 'var(--color-text-secondary)' }}>
              Reopening "{issueToReopen.title}" will clear all existing votes and return it to voting. This cannot be undone.
            </p>
            <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end' }}>
              <button
                onClick={() => setIssueToReopen(null)}
                disabled={reopening}
                style={{
                  padding: '0.5rem 1rem',
                  border: '1px solid var(--color-border-default)',
                  borderRadius: '0.5rem',
                  backgroundColor: 'transparent',
                  color: 'var(--color-text-secondary)',
                  fontSize: '0.875rem',
                  cursor: reopening ? 'not-allowed' : 'pointer',
                }}
              >
                Cancel
              </button>
              <button
                onClick={handleReopenIssue}
                disabled={reopening}
                style={{
                  padding: '0.5rem 1rem',
                  border: 'none',
                  borderRadius: '0.5rem',
                  backgroundColor: reopening ? 'var(--color-bg-surface)' : 'var(--color-warning)',
                  color: reopening ? 'var(--color-text-muted)' : 'var(--color-text-inverse)',
                  fontSize: '0.875rem',
                  fontWeight: 500,
                  cursor: reopening ? 'not-allowed' : 'pointer',
                }}
              >
                {reopening ? 'Reopening…' : 'Reopen'}
              </button>
            </div>
          </div>
        </div>
      )}

      <ReadinessGuide />
    </div>
  )
}

function normalizeUrl(url: string): string {
  if (url.startsWith('http://') || url.startsWith('https://')) return url
  return `https://${url}`
}

function getExternalLinkLabel(url: string): string {
  try {
    const hostname = new URL(normalizeUrl(url)).hostname
    if (hostname.includes('atlassian.net')) return 'Jira'
    if (hostname.includes('github.com')) return 'GitHub'
    if (hostname.includes('linear.app')) return 'Linear'
    if (hostname.includes('notion.so')) return 'Notion'
    return hostname.replace(/^www\./, '')
  } catch {
    return 'External link'
  }
}

const POKER_VALUES = ['1', '2', '3', '5', '8']

interface IssueRowProps {
  issue: Issue
  isOwner: boolean
  isMember: boolean
  currentUserId: string | null
  onDelete: () => void
  onVote: (value: string) => void
  onReveal: () => void
  onReopen: () => void
}

function IssueRow({ issue, isOwner, isMember, currentUserId, onDelete, onVote, onReveal, onReopen }: IssueRowProps) {
  const voters = Object.entries(issue.votes ?? {})
  const myVote = currentUserId ? issue.votes?.[currentUserId]?.value ?? null : null

  const fibAverage: number | null = (() => {
    if (!issue.revealed || voters.length === 0) return null
    const nums = voters
      .map(([, v]) => Number(v.value))
      .filter((n) => !isNaN(n) && n > 0)
    if (nums.length === 0) return null
    const avg = nums.reduce((a, b) => a + b, 0) / nums.length
    return roundUpToFibonacci(avg)
  })()

  const externalLinkEl = issue.externalUrl ? (
    <a
      href={normalizeUrl(issue.externalUrl)}
      target="_blank"
      rel="noopener noreferrer"
      title={issue.externalUrl}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '0.25rem',
        fontSize: '0.75rem',
        color: 'var(--color-primary)',
        textDecoration: 'none',
        marginBottom: '0.375rem',
      }}
    >
      <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
        <path d="M5 2H2a1 1 0 0 0-1 1v7a1 1 0 0 0 1 1h7a1 1 0 0 0 1-1V7" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M8 1h3m0 0v3m0-3L5.5 6.5" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
      {getExternalLinkLabel(issue.externalUrl)}
    </a>
  ) : null

  const deleteButtonEl = isOwner ? (
    <button
      onClick={onDelete}
      title="Delete issue"
      style={{
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
  ) : null

  if (issue.revealed) {
    return (
      <div
        style={{
          backgroundColor: 'var(--color-bg-page)',
          border: '1px solid var(--color-bg-elevated)',
          borderRadius: '0.75rem',
          padding: '1rem 1.25rem',
        }}
      >
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap', flex: 1, minWidth: 0 }}>
            <span style={{ fontSize: '0.9375rem', fontWeight: 500, color: 'var(--color-text-secondary)' }}>
              {issue.title}
            </span>
            <span
              style={{
                fontSize: '0.6875rem',
                fontWeight: 600,
                padding: '0.125rem 0.5rem',
                borderRadius: '9999px',
                backgroundColor: 'var(--color-success-badge-bg)',
                color: 'var(--color-success)',
                letterSpacing: '0.03em',
                textTransform: 'uppercase',
              }}
            >
              Revealed
            </span>
          </div>
          {deleteButtonEl}
        </div>

        {externalLinkEl}

        {issue.description && (
          <p style={{ margin: '0 0 0.75rem 0', fontSize: '0.8125rem', color: 'var(--color-text-secondary)', lineHeight: 1.5 }}>
            {issue.description}
          </p>
        )}

        {/* Voter list */}
        {voters.length > 0 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginTop: '0.25rem' }}>
            {voters.map(([uid, voter]) => (
              <div key={uid} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <VoterAvatar displayName={voter.displayName} photoURL={voter.photoURL} value={null} />
                  <span style={{ fontSize: '0.875rem', color: 'var(--color-text-secondary)' }}>
                    {voter.displayName ?? 'Voter'}
                  </span>
                </div>
                <span style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--color-text-primary)' }}>
                  {voter.value}
                </span>
              </div>
            ))}
          </div>
        )}

        {/* Divider + Average/Reopen row */}
        <div style={{ height: '1px', backgroundColor: 'var(--color-border-default)', margin: '0.75rem 0' }} />
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          {fibAverage !== null && (
            <>
              <span style={{ fontSize: '0.8125rem', color: 'var(--color-text-secondary)', flexShrink: 0 }}>Average</span>
              <span
                style={{
                  fontSize: '0.875rem',
                  fontWeight: 700,
                  color: 'var(--color-success)',
                  backgroundColor: 'var(--color-success-chip-bg)',
                  border: '1px solid var(--color-success-chip-border)',
                  borderRadius: '0.375rem',
                  padding: '0.125rem 0.5rem',
                  lineHeight: 1.5,
                  flexShrink: 0,
                }}
              >
                {fibAverage}
              </span>
              {getReadinessLabel(fibAverage) && (
                <span
                  style={{
                    borderLeft: '2px solid var(--color-primary)',
                    paddingLeft: '0.5rem',
                    fontSize: '0.75rem',
                    color: 'var(--color-text-secondary)',
                    lineHeight: 1.4,
                    flex: 1,
                  }}
                >
                  {getReadinessLabel(fibAverage)}
                </span>
              )}
            </>
          )}
          {isOwner && (
            <button
              onClick={onReopen}
              style={{
                marginLeft: 'auto',
                padding: '0.375rem 0.875rem',
                border: '1px solid var(--color-primary)',
                borderRadius: '0.5rem',
                backgroundColor: 'transparent',
                color: 'var(--color-primary)',
                fontSize: '0.8125rem',
                fontWeight: 500,
                cursor: 'pointer',
                flexShrink: 0,
              }}
            >
              Reopen
            </button>
          )}
        </div>
      </div>
    )
  }

  // VOTING CARD
  return (
    <div
      style={{
        backgroundColor: 'var(--color-bg-surface)',
        border: '1px solid var(--color-border-default)',
        borderRadius: '0.75rem',
        padding: '1rem 1.25rem',
      }}
    >
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap', flex: 1, minWidth: 0 }}>
          <span style={{ fontSize: '0.9375rem', fontWeight: 500, color: 'var(--color-text-primary)' }}>
            {issue.title}
          </span>
          <span
            style={{
              fontSize: '0.6875rem',
              fontWeight: 600,
              padding: '0.125rem 0.5rem',
              borderRadius: '9999px',
              backgroundColor: 'var(--color-warning-badge-bg)',
              color: 'var(--color-warning)',
              letterSpacing: '0.03em',
              textTransform: 'uppercase',
            }}
          >
            Voting
          </span>
        </div>
        {deleteButtonEl}
      </div>

      {externalLinkEl}

      {issue.description && (
        <p style={{ margin: '0 0 0.5rem 0', fontSize: '0.8125rem', color: 'var(--color-text-secondary)', lineHeight: 1.5 }}>
          {issue.description}
        </p>
      )}

      {/* Voter avatars — shown above voting buttons */}
      {voters.length > 0 && (
        <div style={{ display: 'flex', gap: '0.25rem', marginBottom: '0.5rem', flexWrap: 'wrap', alignItems: 'center' }}>
          {voters.map(([uid, voter]) => (
            <VoterAvatar
              key={uid}
              displayName={voter.displayName}
              photoURL={voter.photoURL}
              value={null}
            />
          ))}
        </div>
      )}

      {/* Voting panel */}
      {currentUserId && isMember && (
        <div>
          <div style={{ display: 'flex', gap: '0.375rem', flexWrap: 'wrap' }}>
            {POKER_VALUES.map((v) => {
              const selected = myVote === v
              return (
                <button
                  key={v}
                  onClick={() => onVote(v)}
                  title={`Vote ${v}`}
                  style={{
                    width: '2.25rem',
                    height: '3rem',
                    border: selected
                      ? '2px solid var(--color-primary)'
                      : '1px solid var(--color-border-default)',
                    borderRadius: '0.375rem',
                    backgroundColor: selected ? 'var(--color-primary)' : 'var(--color-bg-elevated)',
                    color: selected ? 'var(--color-text-inverse)' : 'var(--color-text-secondary)',
                    fontSize: '0.875rem',
                    fontWeight: selected ? 700 : 400,
                    cursor: 'pointer',
                    transition: 'background-color 0.1s, border-color 0.1s, color 0.1s',
                  }}
                >
                  {v}
                </button>
              )
            })}
          </div>
          {myVote !== null && getReadinessLabel(Number(myVote)) && (
            <span
              style={{
                display: 'inline-block',
                marginTop: '0.375rem',
                borderLeft: '2px solid var(--color-primary)',
                paddingLeft: '0.5rem',
                fontSize: '0.75rem',
                color: 'var(--color-text-secondary)',
                lineHeight: 1.4,
              }}
            >
              {getReadinessLabel(Number(myVote))}
            </span>
          )}
        </div>
      )}

      {/* Bottom row: vote count left, reveal button right */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '0.75rem' }}>
        <span style={{ fontSize: '0.8125rem', color: 'var(--color-text-secondary)' }}>
          {voters.length} {voters.length === 1 ? 'vote' : 'votes'}
        </span>
        {isOwner && (
          <button
            onClick={onReveal}
            style={{
              padding: '0.375rem 0.875rem',
              border: 'none',
              borderRadius: '0.5rem',
              backgroundColor: 'var(--color-primary)',
              color: 'var(--color-text-inverse)',
              fontSize: '0.8125rem',
              fontWeight: 500,
              cursor: 'pointer',
            }}
          >
            Reveal votes
          </button>
        )}
      </div>
    </div>
  )
}

function VoterAvatar({ displayName, photoURL, value }: { displayName: string | null; photoURL: string | null; value: string | null }) {
  const initials = displayName
    ? displayName.split(' ').map((n) => n[0]).slice(0, 2).join('').toUpperCase()
    : '?'
  const title = value != null
    ? `${displayName ?? 'Voter'}: ${value}`
    : (displayName ?? 'Voter')

  const avatar = photoURL ? (
    <img
      src={photoURL}
      alt={displayName ?? 'Voter'}
      style={{
        width: '24px',
        height: '24px',
        borderRadius: '50%',
        border: '1px solid var(--color-border-default)',
        objectFit: 'cover',
        flexShrink: 0,
      }}
    />
  ) : (
    <div
      style={{
        width: '24px',
        height: '24px',
        borderRadius: '50%',
        backgroundColor: 'var(--color-primary)',
        color: 'var(--color-text-inverse)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '0.6875rem',
        fontWeight: 600,
        flexShrink: 0,
      }}
    >
      {initials}
    </div>
  )

  if (value != null) {
    return (
      <div title={title} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.125rem' }}>
        {avatar}
        <span style={{ fontSize: '0.625rem', fontWeight: 700, color: 'var(--color-text-secondary)', lineHeight: 1 }}>
          {value}
        </span>
      </div>
    )
  }

  return <div title={title}>{avatar}</div>
}
