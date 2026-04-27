import { useEffect, useState } from 'react'
import {
  collection,
  query,
  orderBy,
  onSnapshot,
  addDoc,
  deleteDoc,
  doc,
  serverTimestamp,
  writeBatch,
  updateDoc,
  increment,
} from 'firebase/firestore'
import { db } from '../lib/firebase'
import type { User } from 'firebase/auth'

export interface VoterInfo {
  value: string | null
  displayName: string | null
  photoURL: string | null
}

export interface Issue {
  id: string
  title: string
  description?: string
  externalUrl?: string
  order: number
  revealed: boolean
  votes: Record<string, VoterInfo>
  creator_uid: string
  createdAt: { toMillis: () => number } | null
}

export function useIssues(sessionId: string | undefined, user: User | null) {
  const [issues, setIssues] = useState<Issue[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!sessionId || !user) {
      setIssues([])
      setLoading(false)
      return
    }

    const q = query(
      collection(db, 'sessions', sessionId, 'issues'),
      orderBy('order', 'asc'),
    )

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const list = snapshot.docs.map((d) => ({
          id: d.id,
          ...(d.data() as Omit<Issue, 'id'>),
        }))
        setIssues(list)
        setLoading(false)
        setError(null)
      },
      () => {
        setError('Failed to load issues. Please refresh.')
        setLoading(false)
      },
    )

    return unsubscribe
  }, [sessionId, user])

  async function addIssue(title: string, description?: string, externalUrl?: string) {
    if (!sessionId || !user) return
    const nextOrder =
      issues.length > 0 ? Math.max(...issues.map((i) => i.order)) + 1 : 0
    const issueData: Record<string, unknown> = {
      title: title.trim(),
      description: description?.trim() ?? '',
      order: nextOrder,
      revealed: false,
      votes: {},
      creator_uid: user.uid,
      createdAt: serverTimestamp(),
    }
    if (externalUrl?.trim()) {
      issueData.externalUrl = externalUrl.trim()
    }
    await addDoc(collection(db, 'sessions', sessionId, 'issues'), issueData)
    await updateDoc(doc(db, 'sessions', sessionId), {
      openIssues: increment(1),
    })
  }

  async function addIssues(items: Array<{ title: string; externalUrl?: string }>) {
    if (!sessionId || !user || items.length === 0) return
    const startOrder =
      issues.length > 0 ? Math.max(...issues.map((i) => i.order)) + 1 : 0
    const batch = writeBatch(db)
    const issuesCol = collection(db, 'sessions', sessionId, 'issues')
    items.forEach((item, idx) => {
      const ref = doc(issuesCol)
      const issueData: Record<string, unknown> = {
        title: item.title.trim(),
        description: '',
        order: startOrder + idx,
        revealed: false,
        votes: {},
        creator_uid: user.uid,
        createdAt: serverTimestamp(),
      }
      if (item.externalUrl?.trim()) {
        issueData.externalUrl = item.externalUrl.trim()
      }
      batch.set(ref, issueData)
    })
    batch.update(doc(db, 'sessions', sessionId), {
      openIssues: increment(items.length),
    })
    await batch.commit()
  }

  async function deleteIssue(issueId: string) {
    if (!sessionId) return
    const issue = issues.find((i) => i.id === issueId)
    await deleteDoc(doc(db, 'sessions', sessionId, 'issues', issueId))
    if (issue) {
      await updateDoc(doc(db, 'sessions', sessionId), {
        [issue.revealed ? 'revealedIssues' : 'openIssues']: increment(-1),
      })
    }
  }

  async function moveIssue(issueId: string, direction: 'up' | 'down') {
    if (!sessionId) return
    const index = issues.findIndex((i) => i.id === issueId)
    if (index === -1) return
    const swapIndex = direction === 'up' ? index - 1 : index + 1
    if (swapIndex < 0 || swapIndex >= issues.length) return

    const batch = writeBatch(db)
    batch.update(doc(db, 'sessions', sessionId, 'issues', issues[index].id), {
      order: issues[swapIndex].order,
    })
    batch.update(
      doc(db, 'sessions', sessionId, 'issues', issues[swapIndex].id),
      { order: issues[index].order },
    )
    await batch.commit()
  }

  async function castVote(issueId: string, value: string) {
    if (!sessionId || !user) return
    await updateDoc(doc(db, 'sessions', sessionId, 'issues', issueId), {
      [`votes.${user.uid}`]: {
        value,
        displayName: user.displayName ?? null,
        photoURL: user.photoURL ?? null,
      },
    })
  }

  async function revealVotes(issueId: string) {
    if (!sessionId) return
    await updateDoc(doc(db, 'sessions', sessionId, 'issues', issueId), {
      revealed: true,
    })
    await updateDoc(doc(db, 'sessions', sessionId), {
      openIssues: increment(-1),
      revealedIssues: increment(1),
    })
  }

  async function reopenIssue(issueId: string) {
    if (!sessionId) return
    await updateDoc(doc(db, 'sessions', sessionId, 'issues', issueId), {
      revealed: false,
      votes: {},
    })
    await updateDoc(doc(db, 'sessions', sessionId), {
      openIssues: increment(1),
      revealedIssues: increment(-1),
    })
  }

  return { issues, loading, error, addIssue, addIssues, deleteIssue, moveIssue, castVote, revealVotes, reopenIssue }
}
