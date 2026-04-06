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
  order: number
  revealed: boolean
  votes: Record<string, VoterInfo>
  creator_uid: string
  createdAt: { toMillis: () => number } | null
}

export function useIssues(sessionId: string | undefined, user: User | null) {
  const [issues, setIssues] = useState<Issue[]>([])
  const [loading, setLoading] = useState(true)

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

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const list = snapshot.docs.map((d) => ({
        id: d.id,
        ...(d.data() as Omit<Issue, 'id'>),
      }))
      setIssues(list)
      setLoading(false)
    })

    return unsubscribe
  }, [sessionId, user])

  async function addIssue(title: string, description?: string) {
    if (!sessionId || !user) return
    const nextOrder =
      issues.length > 0 ? Math.max(...issues.map((i) => i.order)) + 1 : 0
    await addDoc(collection(db, 'sessions', sessionId, 'issues'), {
      title: title.trim(),
      description: description?.trim() ?? '',
      order: nextOrder,
      revealed: false,
      votes: {},
      creator_uid: user.uid,
      createdAt: serverTimestamp(),
    })
  }

  async function deleteIssue(issueId: string) {
    if (!sessionId) return
    await deleteDoc(doc(db, 'sessions', sessionId, 'issues', issueId))
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

  return { issues, loading, addIssue, deleteIssue, moveIssue, castVote }
}
